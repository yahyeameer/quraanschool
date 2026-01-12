import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const logProgress = mutation({
    args: {
        surahName: v.string(),
        ayahStart: v.number(),
        ayahEnd: v.number(),
        rating: v.number(),
        notes: v.optional(v.string()),
        type: v.string(), // "hifz" or "review"
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        // We don't strictly require classId for self-tracking, so we can make it optional in schema or just omit if schema allows
        // Looking at schema: dailyProgress table requires studentId, classId, teacherId...
        // The previous schema design assumed tracking happens IN a class context.
        // To allow self-tracking, we might need to make classId/teacherId optional in schema or create a separate table.
        // For now, let's create a *new* table for self-tracking or adjust schema?
        // Let's stick to the schema but check if we can make those optional.
        // Wait, the schema in quraan.md/schema.ts was logging to `dailyProgress` with required fields.
        // Let's create a NEW table for flexible tracking or relax the schema requirements.
        // Since I can edit schema, I will add a `tracker_logs` table for student self-service tracking.

        return await ctx.db.insert("tracker_logs", {
            studentId: user._id,
            date: new Date().toISOString(),
            surahName: args.surahName,
            ayahStart: args.ayahStart,
            ayahEnd: args.ayahEnd,
            rating: args.rating,
            notes: args.notes,
            type: args.type,
        });
    },
});

export const getHistory = query({
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
            .query("tracker_logs")
            .withIndex("by_student", (q) => q.eq("studentId", user._id))
            .order("desc")
            .take(20);
    },
});
