import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addExpense = mutation({
    args: {
        title: v.string(),
        amount: v.number(),
        category: v.string(),
        date: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new Error("Unauthorized");

        const recorder = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", user.subject))
            .first();

        if (!recorder || (recorder.role !== "admin" && recorder.role !== "manager")) {
            throw new Error("Unauthorized");
        }

        await ctx.db.insert("expenses", {
            ...args,
            recordedBy: recorder._id,
        });
    },
});

export const listExpenses = query({
    args: {
        month: v.optional(v.string()), // Format: YYYY-MM
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("expenses");

        // Simple filter in memory for now if month provided, 
        // ideally use range query if date format allows
        const all = await q.collect();

        if (args.month) {
            return all.filter(e => e.date.startsWith(args.month!)).sort((a, b) => b.date.localeCompare(a.date));
        }

        return all.sort((a, b) => b.date.localeCompare(a.date));
    },
});

export const deleteExpense = mutation({
    args: { id: v.id("expenses") },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new Error("Unauthorized");
        // Add role check
        await ctx.db.delete(args.id);
    },
});

export const getFinancialSummary = query({
    handler: async (ctx) => {
        // This is expensive for large data, but fine for MVP
        const expenses = await ctx.db.query("expenses").collect();
        const payments = await ctx.db.query("payments").collect();

        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        return {
            totalRevenue,
            totalExpenses,
            netProfit: totalRevenue - totalExpenses
        };
    }
});
