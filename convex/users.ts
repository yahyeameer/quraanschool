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
        let user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        const email = identity.email;
        const phone = identity.phoneNumber; // Get phone from Clerk

        // Check for pending invitation (Email OR Phone) if user is new OR is a guest
        // This ensures if someone signed up before invitation, or sync failed, we retry
        if (user === null || user.role === "guest") {
            let invitation = null;

            if (email) {
                invitation = await ctx.db
                    .query("invitations")
                    .withIndex("by_email", (q) => q.eq("email", email))
                    .unique();
            }

            if (!invitation && phone) {
                invitation = await ctx.db
                    .query("invitations")
                    .withIndex("by_phone", (q) => q.eq("phone", phone))
                    .unique();
            }

            // If valid invitation exists, assign role and mark accepted
            if (invitation && invitation.status === "pending") {
                const newRole = invitation.role;
                await ctx.db.patch(invitation._id, { status: "accepted" });

                if (user) {
                    // Update existing guest
                    await ctx.db.patch(user._id, {
                        role: newRole as any,
                        name: identity.name || invitation.studentName || user.name
                    });
                    return user._id;
                } else {
                    // Will create new user with this role below
                    // Just pass the role to the insert
                    // We need to refactor the insert flow slightly

                    // Create new user
                    const newUserId = await ctx.db.insert("users", {
                        clerkId: identity.subject,
                        name: identity.name || invitation?.studentName || "Anonymous",
                        email: email,
                        phone: phone,
                        role: newRole as any,
                        avatarUrl: identity.pictureUrl,
                    });
                    return newUserId;
                }
            }
        }

        if (user !== null) {
            return user._id;
        }

        // Create new user (default guest)
        const newUserId = await ctx.db.insert("users", {
            clerkId: identity.subject,
            name: identity.name || "Anonymous",
            email: email,
            phone: phone,
            role: "guest",
            avatarUrl: identity.pictureUrl,
        });

        return newUserId;
    },
});

export const completeOnboarding = mutation({
    args: { role: v.string() }, // "student" | "teacher" | "parent"
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // SECURITY FIX: Only allow safe roles during self-onboarding
        const allowedRoles = ["student", "teacher", "parent"];
        if (!allowedRoles.includes(args.role)) {
            throw new Error("Invalid role. Please select Student, Teacher, or Parent.");
        }

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

export const getAllStudents = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").withIndex("by_role", q => q.eq("role", "student")).collect();
        return users;
    },
});
