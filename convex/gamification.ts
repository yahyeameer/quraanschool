import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole } from "./permissions";

// Get student stats
export const getStats = query({
    args: { studentId: v.optional(v.id("users")) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return null;

        const targetId = args.studentId || user._id;

        // Get stats
        const stats = await ctx.db
            .query("student_stats")
            .withIndex("by_student", (q) => q.eq("studentId", targetId))
            .unique();

        if (!stats) {
            // Return default stats if not initialized
            return {
                currentStreak: 0,
                longestStreak: 0,
                totalAyahs: 0,
                points: 0,
                level: 1,
            };
        }

        return stats;
    },
});

// Update streak (called on daily login/activity)
export const updateStreak = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || user.role !== "student") return;

        const today = new Date().toISOString().split("T")[0];

        const stats = await ctx.db
            .query("student_stats")
            .withIndex("by_student", (q) => q.eq("studentId", user._id))
            .unique();

        if (!stats) {
            // Initialize
            await ctx.db.insert("student_stats", {
                studentId: user._id,
                currentStreak: 1,
                longestStreak: 1,
                lastLoginDate: today,
                totalAyahs: 0,
                points: 10, // Bonus for first time
                level: 1,
            });
            return;
        }

        if (stats.lastLoginDate === today) return; // Already updated today

        const lastLogin = new Date(stats.lastLoginDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let newStreak = stats.currentStreak;
        if (stats.lastLoginDate === yesterdayStr) {
            newStreak += 1;
        } else {
            newStreak = 1; // Reset
        }

        const newLongest = Math.max(newStreak, stats.longestStreak);
        const newPoints = stats.points + 10; // Daily login points

        await ctx.db.patch(stats._id, {
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastLoginDate: today,
            points: newPoints,
        });
    },
});

// Get achievements
export const getAchievements = query({
    args: { studentId: v.optional(v.id("users")) },
    handler: async (ctx, args) => {
        // Similar auth check...
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return [];

        const targetId = args.studentId || user._id;

        return await ctx.db
            .query("achievements")
            .withIndex("by_student", (q) => q.eq("studentId", targetId))
            .collect();
    }
});

// Get Leaderboard
export const getLeaderboard = query({
    args: {},
    handler: async (ctx) => {
        // Limit to top 10
        const topStats = await ctx.db
            .query("student_stats")
            .withIndex("by_points")
            .order("desc")
            .take(10);

        // Enrich with names
        const enriched = await Promise.all(topStats.map(async (stat) => {
            const student = await ctx.db.get(stat.studentId);
            return {
                ...stat,
                studentName: student?.name || "Unknown"
            };
        }));

        return enriched;
    }
});
