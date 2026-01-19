import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return [];

        return await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .take(20);
    },
});

export const markAsRead = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.notificationId, { isRead: true });
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
        title: v.string(),
        message: v.string(),
        type: v.string(),
        link: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("notifications", {
            ...args,
            isRead: false,
            createdAt: new Date().toISOString(),
        });
    },
});
