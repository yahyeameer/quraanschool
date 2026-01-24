import { v } from "convex/values";
import { query } from "./_generated/server";
import { hasAnyRole } from "./permissions";

export const getAcademicVelocity = query({
    args: {},
    handler: async (ctx) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager"]);
        if (!hasRole) return [];

        // Aggregate progress
        // We will look at 'tracker_logs' (Ayah memorization) or 'dailyProgress'
        // Let's use tracker_logs for "Ayahs Memorized" velocity

        const logs = await ctx.db.query("tracker_logs").collect();

        // Group by Month (last 6 months)
        const months: Record<string, number> = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${monthNames[d.getMonth()]}`;
            months[key] = 0;
        }

        logs.forEach(log => {
            const d = new Date(log.date);
            const key = `${monthNames[d.getMonth()]}`;
            if (months[key] !== undefined) {
                // Calculate ayahs count
                const count = (log.ayahEnd - log.ayahStart) + 1;
                months[key] += count;
            }
        });

        // Format for Recharts
        const result = Object.entries(months).map(([name, value]) => ({
            name,
            value
        }));

        // If empty data (new system), return mock/zeros or null to handle gracefully
        // Return zeros structure at least
        return result;
    }
});

export const getStudentProgress = query({
    args: { months: v.number() },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager", "teacher", "student", "parent"]);
        if (!hasRole) return [];

        const logs = await ctx.db.query("tracker_logs").collect();

        // Group by month
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const months: Record<string, number> = {};

        const now = new Date();
        for (let i = args.months - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${monthNames[d.getMonth()]}`;
            months[key] = 0;
        }

        logs.forEach(log => {
            const d = new Date(log.date);
            const key = `${monthNames[d.getMonth()]}`;
            if (months[key] !== undefined) {
                const count = (log.ayahEnd - log.ayahStart) + 1;
                months[key] += count;
            }
        });

        return Object.entries(months).map(([month, ayahs]) => ({
            month,
            ayahs
        }));
    }
});

export const getAttendanceStats = query({
    args: {},
    handler: async (ctx) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager", "teacher"]);
        if (!hasRole) return { present: 0, late: 0, absent: 0, rate: 0 };

        const attendance = await ctx.db.query("attendance").collect();

        const present = attendance.filter(a => a.status === "present").length;
        const late = attendance.filter(a => a.status === "late").length;
        const absent = attendance.filter(a => a.status === "absent").length;

        const total = present + late + absent;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;

        return { present, late, absent, rate };
    }
});

export const getClassComparison = query({
    args: {},
    handler: async (ctx) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager", "teacher"]);
        if (!hasRole) return [];

        const classes = await ctx.db.query("classes").collect();
        const dailyProgress = await ctx.db.query("dailyProgress").collect();

        // Calculate average rating per class
        const classRatings = await Promise.all(classes.map(async (cls) => {
            const classProgress = dailyProgress.filter(p => p.classId === cls._id);
            const avgRating = classProgress.length > 0
                ? classProgress.reduce((sum, p) => sum + p.rating, 0) / classProgress.length
                : 0;

            return {
                className: cls.name,
                avgRating: parseFloat(avgRating.toFixed(1))
            };
        }));

        // Sort by rating descending
        return classRatings.sort((a, b) => b.avgRating - a.avgRating);
    }
});
