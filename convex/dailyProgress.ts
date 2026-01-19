import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole } from "./permissions";

export const logProgress = mutation({
    args: {
        studentId: v.id("users"),
        classId: v.id("classes"),
        surahName: v.string(),
        ayahStart: v.number(),
        ayahEnd: v.number(),
        rating: v.number(),
        notes: v.optional(v.string()),
        status: v.string(), // "Passed", "Needs Review", "Failed"
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        return await ctx.db.insert("dailyProgress", {
            ...args,
            teacherId: user._id,
            date: new Date().toISOString().split('T')[0],
        });
    },
});

export const getStudentProgressHistory = query({
    args: { studentId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("dailyProgress")
            .withIndex("by_student_date", (q) => q.eq("studentId", args.studentId))
            .order("desc")
            .collect();
    },
});
