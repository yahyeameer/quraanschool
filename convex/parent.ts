import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireRole } from "./permissions";

export const getChildren = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const parent = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!parent || parent.role !== "parent") return [];

        const children = await ctx.db
            .query("users")
            .withIndex("by_parent", (q) => q.eq("parentId", parent._id))
            .collect();

        return children;
    },
});

export const getChildDashboardData = query({
    args: { studentId: v.id("users") },
    handler: async (ctx, args) => {
        const student = await ctx.db.get(args.studentId);
        if (!student) return null;

        // Fetch recent progress
        const progress = await ctx.db
            .query("dailyProgress")
            .withIndex("by_student_date", (q) => q.eq("studentId", args.studentId))
            .order("desc")
            .take(5);

        // Fetch recent attendance
        const attendance = await ctx.db
            .query("attendance")
            .filter(q => q.eq(q.field("studentId"), args.studentId))
            .order("desc")
            .take(10);

        // Fetch pending/recent payments
        const payments = await ctx.db
            .query("payments")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .order("desc")
            .take(5);

        return {
            student,
            progress,
            attendance,
            payments
        };
    },
});
