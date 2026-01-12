import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("classes").collect();
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        category: v.string(),
        schedule: v.array(v.object({ day: v.string(), time: v.string() })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // Find the user in our database
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            throw new Error("User not found in database. Please log in again.");
        }

        const classId = await ctx.db.insert("classes", {
            name: args.name,
            category: args.category,
            schedule: args.schedule,
            teacherId: user._id,
        });
        return classId;
    },
});
