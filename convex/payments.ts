import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole } from "./permissions";

export const list = query({
    args: {},
    handler: async (ctx) => {
        await requireRole(ctx, "admin");
        return await ctx.db.query("payments").collect();
    },
});

export const logPayment = mutation({
    args: {
        studentId: v.id("users"),
        amount: v.number(),
        month: v.string(),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");
        return await ctx.db.insert("payments", {
            studentId: args.studentId,
            amount: args.amount,
            month: args.month,
            date: new Date().toISOString(),
            status: "paid",
        });
    },
});

export const getStudentPayments = query({
    args: { studentId: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db
            .query("payments")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .collect();
    },
});
