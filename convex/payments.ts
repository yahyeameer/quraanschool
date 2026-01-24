import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole, hasAnyRole } from "./permissions";

// List all payments (admin only)
export const list = query({
    args: {},
    handler: async (ctx) => {
        await requireRole(ctx, "admin");
        return await ctx.db.query("payments").order("desc").collect();
    },
});

// Log a new payment
export const logPayment = mutation({
    args: {
        studentId: v.id("users"),
        amount: v.number(),
        month: v.string(),
        status: v.optional(v.string()), // "paid" | "pending"
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");
        return await ctx.db.insert("payments", {
            studentId: args.studentId,
            amount: args.amount,
            month: args.month,
            date: new Date().toISOString(),
            status: args.status || "paid",
        });
    },
});

// Get payments for a specific student
export const getStudentPayments = query({
    args: { studentId: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db
            .query("payments")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .order("desc")
            .collect();
    },
});

// Update payment status
export const updatePaymentStatus = mutation({
    args: {
        paymentId: v.id("payments"),
        status: v.string(), // "paid" | "pending"
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");
        await ctx.db.patch(args.paymentId, { status: args.status });
    },
});

// Delete a payment record
export const deletePayment = mutation({
    args: { paymentId: v.id("payments") },
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");
        await ctx.db.delete(args.paymentId);
    },
});

// Get payment summary for dashboard
export const getPaymentSummary = query({
    args: {},
    handler: async (ctx) => {
        await requireRole(ctx, "admin");

        const payments = await ctx.db.query("payments").collect();

        const totalPaid = payments
            .filter(p => p.status === "paid")
            .reduce((sum, p) => sum + p.amount, 0);

        const totalPending = payments
            .filter(p => p.status === "pending")
            .reduce((sum, p) => sum + p.amount, 0);

        // Get current month payments
        const now = new Date();
        const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        const thisMonthPayments = payments.filter(p => p.month === currentMonth);
        const thisMonthTotal = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);

        return {
            totalPaid,
            totalPending,
            thisMonthTotal,
            totalTransactions: payments.length,
            paidCount: payments.filter(p => p.status === "paid").length,
            pendingCount: payments.filter(p => p.status === "pending").length,
        };
    },
});

// Get pending payments (for reminders)
export const getPendingPayments = query({
    args: {},
    handler: async (ctx) => {
        await requireRole(ctx, "admin");

        return await ctx.db
            .query("payments")
            .withIndex("by_status", (q) => q.eq("status", "pending"))
            .collect();
    },
});
