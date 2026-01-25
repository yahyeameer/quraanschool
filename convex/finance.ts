import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole, hasAnyRole } from "./permissions";

// --- Fees Management ---

export const getFees = query({
    args: { month: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["manager", "admin", "accountant"]);
        if (!hasRole) throw new Error("Unauthorized");

        // Get all students
        const students = await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", "student"))
            .collect();

        const currentMonth = args.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

        // Get payments for this month
        const payments = await ctx.db
            .query("payments")
            .collect();

        // Join data
        return students.map(student => {
            const payment = payments.find(p => p.studentId === student._id && p.month === currentMonth);
            return {
                student,
                status: payment ? payment.status : "unpaid",
                amount: payment ? payment.amount : 0,
                paymentDate: payment ? payment.date : null,
                paymentId: payment ? payment._id : null
            };
        });
    }
});

export const logFeePayment = mutation({
    args: {
        studentId: v.id("users"),
        amount: v.number(),
        month: v.string(),
        notes: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["manager", "admin", "accountant"]);
        if (!hasRole) throw new Error("Unauthorized");

        // Check if already paid
        const existing = await ctx.db
            .query("payments")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .filter(q => q.eq(q.field("month"), args.month))
            .unique();

        if (existing) {
            throw new Error("Payment already recorded for this month");
        }

        await ctx.db.insert("payments", {
            studentId: args.studentId,
            amount: args.amount,
            month: args.month,
            date: new Date().toISOString(),
            status: "paid",
        });
    }
});

// --- Salary Management ---

export const getSalaries = query({
    args: { month: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["manager", "admin", "accountant"]);
        if (!hasRole) throw new Error("Unauthorized");

        // Get all staff
        const staff = await ctx.db
            .query("users")
            .collect();
        // Filter in memory for specific roles to avoid complex index logic for now
        const eligibleStaff = staff.filter(u => ["teacher", "manager", "staff", "accountant", "librarian", "receptionist"].includes(u.role));

        const currentMonth = args.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

        const salaries = await ctx.db
            .query("salaries")
            .withIndex("by_month", (q) => q.eq("month", currentMonth))
            .collect();

        return eligibleStaff.map(member => {
            const salary = salaries.find(s => s.staffId === member._id);
            return {
                staff: member,
                status: salary ? salary.status : "pending",
                amount: salary ? salary.totalAmount : 0,
                paymentDate: salary ? salary.paymentDate : null,
                salaryId: salary ? salary._id : null
            };
        });
    }
});

export const payoutSalary = mutation({
    args: {
        staffId: v.id("users"),
        amount: v.number(),
        month: v.string(),
        notes: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["manager", "admin", "accountant"]);
        if (!hasRole) throw new Error("Unauthorized");

        const existing = await ctx.db
            .query("salaries")
            .withIndex("by_staff", (q) => q.eq("staffId", args.staffId))
            .filter(q => q.eq(q.field("month"), args.month))
            .unique();

        if (existing) {
            throw new Error("Salary already paid for this month");
        }

        await ctx.db.insert("salaries", {
            staffId: args.staffId,
            baseAmount: args.amount,
            adjustments: 0,
            totalAmount: args.amount,
            month: args.month,
            status: "paid",
            paymentDate: new Date().toISOString(),
            generatedAt: new Date().toISOString(),
        });
    }
});

// --- Financial Summary ---

export const getFinancialOverview = query({
    args: {},
    handler: async (ctx) => {
        const { hasRole } = await hasAnyRole(ctx, ["manager", "admin", "accountant"]);
        if (!hasRole) throw new Error("Unauthorized");

        const payments = await ctx.db.query("payments").collect();
        const salaries = await ctx.db.query("salaries").collect();

        const totalRevenue = payments.reduce((sum, p) => sum + (p.status === "paid" ? p.amount : 0), 0);
        const totalExpenses = salaries.reduce((sum, s) => sum + (s.status === "paid" ? s.totalAmount : 0), 0);
        const netIncome = totalRevenue - totalExpenses;

        return {
            totalRevenue,
            totalExpenses,
            netIncome
        };
    }
});
