import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasAnyRole } from "./permissions";

export const addExpense = mutation({
    args: {
        title: v.string(),
        amount: v.number(),
        category: v.string(),
        date: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { hasRole, user } = await hasAnyRole(ctx, ["admin", "manager", "accountant"]);

        if (!hasRole || !user) {
            throw new Error("Unauthorized");
        }

        await ctx.db.insert("expenses", {
            ...args,
            recordedBy: user._id,
        });
    },
});

export const listExpenses = query({
    args: {
        month: v.optional(v.string()), // Format: YYYY-MM
    },
    handler: async (ctx, args) => {
        const { hasRole, user } = await hasAnyRole(ctx, ["admin", "manager", "accountant"]);
        if (!hasRole || !user) throw new Error("Unauthorized");
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
        const { hasRole, user } = await hasAnyRole(ctx, ["admin", "manager", "accountant"]);
        if (!hasRole || !user) throw new Error("Unauthorized");
        
        await ctx.db.delete(args.id);
    },
});

export const getFinancialSummary = query({
    handler: async (ctx) => {
        const { hasRole, user } = await hasAnyRole(ctx, ["admin", "manager", "accountant"]);
        if (!hasRole || !user) throw new Error("Unauthorized");

        // This is expensive for large data, but fine for MVP
        // Add take(100) as per limits fix to prevent timeout
        const expenses = await ctx.db.query("expenses").take(100);
        const payments = await ctx.db.query("payments").take(100);

        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        return {
            totalRevenue,
            totalExpenses,
            netProfit: totalRevenue - totalExpenses
        };
    }
});
