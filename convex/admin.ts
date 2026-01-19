import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole } from "./permissions";

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        // We assume this is a public dashboard or admin only. Let's restrict to authenticated at least.
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        // For the pulse bar
        const totalStudents = (await ctx.db.query("users").filter(q => q.eq(q.field("role"), "student")).collect()).length;
        // This is expensive in real apps, use counters in reality.

        // Calculate total ayahs memorized (mock logic or sum logs)
        // We'll just count logs for now as a proxy
        const logs = await ctx.db.query("tracker_logs").collect();
        const totalAyahs = logs.reduce((acc, log) => acc + (log.ayahEnd - log.ayahStart + 1), 0);

        return {
            totalStudents,
            totalAyahs,
            activeClasses: (await ctx.db.query("classes").collect()).length
        };
    },
});

export const listUsers = query({
    args: {},
    handler: async (ctx) => {
        await requireRole(ctx, "admin");
        return await ctx.db.query("users").collect();
    }
});

export const updateUserRole = mutation({
    args: { userId: v.id("users"), role: v.string() },
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");
        await ctx.db.patch(args.userId, { role: args.role as any });
    }
});

export const linkStudentToParent = mutation({
    args: { studentId: v.id("users"), parentId: v.string() }, // parentId can be empty string to unlink
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");
        const parentId = args.parentId === "" ? undefined : args.parentId as any;
        await ctx.db.patch(args.studentId, { parentId });
    }
});
