import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        // Check if we already have this user
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user !== null) {
            // If user exists, update if needed, otherwise return their ID
            // For now, let's just return.
            // Optionally update name/email/avatar if changed
            return user._id;
        }

        // Capture explicit role from token if present, otherwise default to "student"
        // Ideally this comes from Clerk's public metadata, but for now we default.
        // If you add Roles in Clerk, they will be in identity.tokenIdentifier or similar claims.

        // Create new user
        const newUserId = await ctx.db.insert("users", {
            clerkId: identity.subject,
            name: identity.name || "Anonymous",
            email: identity.email || "no-email@example.com",
            role: "guest", // Default to guest for onboarding
            avatarUrl: identity.pictureUrl,
        });
        return newUserId;
    },
});

export const completeOnboarding = mutation({
    args: { role: v.string() }, // "student" | "teacher" | "admin"
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, { role: args.role as any });
    },
});

export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        return await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
    },
});
