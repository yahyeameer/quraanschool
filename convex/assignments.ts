import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        classId: v.id("classes"),
        title: v.string(),
        description: v.optional(v.string()),
        dueDate: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        // Ideally check if user is the teacher of classId, but skipping for now

        return await ctx.db.insert("assignments", {
            classId: args.classId,
            teacherId: user._id,
            title: args.title,
            description: args.description,
            dueDate: args.dueDate,
            status: "active",
        });
    },
});

export const listByClass = query({
    args: { classId: v.id("classes") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("assignments")
            .withIndex("by_class", (q) => q.eq("classId", args.classId))
            .order("desc")
            .collect();
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        // Just list all assignments for now (Teacher View)
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db.query("assignments").order("desc").collect();
    },
});
