import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update a fee structure for a student
export const manageFeeStructure = mutation({
    args: {
        studentId: v.id("users"),
        monthlyAmount: v.number(),
        dueDay: v.number(), // 1-28
        discount: v.optional(v.number()),
        notes: v.optional(v.string()),
        status: v.optional(v.string()), // "active", "paused"
    },
    handler: async (ctx, args) => {
        // Auth check - should be manager/admin
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || (user.role !== "admin" && user.role !== "manager")) {
            throw new Error("Only admins/managers can manage fees");
        }

        // Check if structure exists
        const existing = await ctx.db
            .query("fee_structures")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .unique();

        if (existing) {
            // Update
            await ctx.db.patch(existing._id, {
                monthlyAmount: args.monthlyAmount,
                dueDay: args.dueDay,
                discount: args.discount,
                notes: args.notes,
                status: args.status || existing.status,
            });
            return existing._id;
        } else {
            // Create
            const id = await ctx.db.insert("fee_structures", {
                studentId: args.studentId,
                monthlyAmount: args.monthlyAmount,
                dueDay: args.dueDay,
                discount: args.discount,
                notes: args.notes,
                status: args.status || "active",
            });
            return id;
        }
    },
});

// Get a student's fee structure
export const getFeeStructure = query({
    args: { studentId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("fee_structures")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .unique();
    },
});

// Generate monthly payments for all active students (To be called via cron or manually)
export const generateMonthlyPayments = mutation({
    args: {
        month: v.string(), // e.g. "February 2026"
    },
    handler: async (ctx, args) => {
        // Auth check
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // Get all active fee structures
        const feeStructures = await ctx.db
            .query("fee_structures")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();

        let count = 0;

        for (const fee of feeStructures) {
            // Check if payment already exists for this month
            // Note: We need to filter payments by student + month manually since we don't have a specific index
            // Alternatively, we could add an index, but for MVP simpler loop is OK or use existing by_student
            const existingPayments = await ctx.db
                .query("payments")
                .withIndex("by_student", (q) => q.eq("studentId", fee.studentId))
                .filter((q) => q.eq(q.field("month"), args.month))
                .first();

            if (!existingPayments) {
                // Calculate amount
                const amount = fee.monthlyAmount - (fee.discount || 0);

                // Create pending payment
                await ctx.db.insert("payments", {
                    studentId: fee.studentId,
                    amount: Math.max(0, amount), // Ensure non-negative
                    month: args.month,
                    date: new Date().toISOString(), // Generation date
                    status: "pending",
                });

                // Notify parent 
                const student = await ctx.db.get(fee.studentId);
                if (student && student.parentId) {
                    await ctx.db.insert("notifications", {
                        userId: student.parentId,
                        title: "New Invoice Generated",
                        message: `Tuition fee for ${args.month} is now available.`,
                        type: "info",
                        isRead: false,
                        link: "/dashboard/parent/payments",
                        createdAt: new Date().toISOString(),
                    });
                }

                count++;
            }
        }

        return { generated: count };
    },
});

// Get overdue payments with details
export const getOverduePayments = query({
    args: {},
    handler: async (ctx) => {
        // Fetch all pending payments
        const pendingPayments = await ctx.db
            .query("payments")
            .withIndex("by_status", (q) => q.eq("status", "pending"))
            .collect();

        // Enrich with student and parent details
        const overdueWithDetails = await Promise.all(
            pendingPayments.map(async (payment) => {
                const student = await ctx.db.get(payment.studentId);
                if (!student) return null;

                let parent = null;
                if (student.parentId) {
                    parent = await ctx.db.get(student.parentId);
                }

                return {
                    ...payment,
                    studentName: student.name,
                    parentName: parent?.name,
                    parentEmail: parent?.email,
                    parentPhone: parent?.phone,
                };
            })
        );

        return overdueWithDetails.filter((p) => p !== null);
    },
});

// Send reminders for specific payments
export const sendPaymentReminder = mutation({
    args: {
        paymentId: v.id("payments"),
        method: v.optional(v.string()), // "email", "sms", "notification"
    },
    handler: async (ctx, args) => {
        // Auth check
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const payment = await ctx.db.get(args.paymentId);
        if (!payment) throw new Error("Payment not found");

        const student = await ctx.db.get(payment.studentId);
        if (!student || !student.parentId) throw new Error("Student or parent not found");

        const parent = await ctx.db.get(student.parentId);
        if (!parent) throw new Error("Parent not found");

        // 1. Create system notification
        await ctx.db.insert("notifications", {
            userId: parent._id,
            title: "Payment Reminder",
            message: `Friendly reminder: Tuition for ${payment.month} ($${payment.amount}) is pending.`,
            type: "warning",
            isRead: false,
            link: "/dashboard/parent/payments",
            createdAt: new Date().toISOString(),
        });

        // 2. Create a message in the communication system
        // Find a manager to send from (or use current user if manager)
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user) {
            await ctx.db.insert("messages", {
                senderId: user._id,
                recipientId: parent._id,
                subject: `Tuition Reminder: ${payment.month}`,
                message: `Dear ${parent.name},\n\nThis is a friendly reminder that the tuition payment of $${payment.amount} for ${student.name} (${payment.month}) is currently pending.\n\nPlease arrange payment at your earliest convenience.\n\nJazakAllah Khair,\nAl-Maqra'a Administration`,
                isRead: false,
                createdAt: new Date().toISOString(),
                type: "direct",
            });
        }

        return { success: true, recipient: parent.name };
    },
});
