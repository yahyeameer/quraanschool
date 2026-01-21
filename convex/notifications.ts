import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasAnyRole } from "./permissions";

// Get notifications for current user
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

// Get unread count for notification badge
export const getUnreadCount = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return 0;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return 0;

        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        return notifications.filter(n => !n.isRead).length;
    },
});

// Mark single notification as read
export const markAsRead = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.notificationId, { isRead: true });
    },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .filter(q => q.eq(q.field("isRead"), false))
            .collect();

        for (const notification of notifications) {
            await ctx.db.patch(notification._id, { isRead: true });
        }
    },
});

// Create a new notification (internal use)
export const create = mutation({
    args: {
        userId: v.id("users"),
        title: v.string(),
        message: v.string(),
        type: v.string(), // "info" | "success" | "warning" | "error"
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

// Delete a notification
export const deleteNotification = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const notification = await ctx.db.get(args.notificationId);
        if (!notification) throw new Error("Notification not found");

        // Only allow deleting own notifications
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || notification.userId !== user._id) {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.notificationId);
    },
});

// Send notification to multiple users (admin)
export const sendBulkNotification = mutation({
    args: {
        userIds: v.array(v.id("users")),
        title: v.string(),
        message: v.string(),
        type: v.string(),
        link: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");

        const notifications = [];
        for (const userId of args.userIds) {
            const id = await ctx.db.insert("notifications", {
                userId,
                title: args.title,
                message: args.message,
                type: args.type,
                link: args.link,
                isRead: false,
                createdAt: new Date().toISOString(),
            });
            notifications.push(id);
        }
        return notifications;
    },
});
