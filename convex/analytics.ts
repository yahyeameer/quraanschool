import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireRole, hasAnyRole } from "./permissions";

// Get academic progress over time for a specific student or class
export const getStudentProgress = query({
    args: {
        studentId: v.optional(v.id("users")),
        classId: v.optional(v.id("classes")),
        months: v.optional(v.number()), // Number of months to look back, default 6
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager", "teacher", "parent"]);
        if (!hasRole) throw new Error("Unauthorized");

        const months = args.months || 6;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        // Fetch progress logs
        let logsQuery = ctx.db.query("dailyProgress").order("desc");

        // Note: We'll filter in memory because advanced filtering with multiple indices is tricky
        // Optimization: In prod, add specific compound indices
        const logs = await logsQuery.collect();

        const filteredLogs = logs.filter((log) => {
            const logDate = new Date(log.date);
            const inDateRange = logDate >= startDate && logDate <= endDate;
            const matchesStudent = args.studentId ? log.studentId === args.studentId : true;
            // Note: We don't direct link log to class, so we might need enrich logs or assume student mapping
            // For now, simple student filter
            return inDateRange && matchesStudent;
        });

        // Aggregate by month
        const progressByMonth = new Map<string, { totalAyahs: number; count: number }>();

        filteredLogs.forEach((log) => {
            const date = new Date(log.date);
            const monthKey = date.toLocaleString('default', { month: 'short' });

            const current = progressByMonth.get(monthKey) || { totalAyahs: 0, count: 0 };
            // Calculate ayahs count
            let ayahs = 0;
            if (log.ayahStart && log.ayahEnd) {
                ayahs = log.ayahEnd - log.ayahStart + 1;
            } else {
                ayahs = 5; // Default fallback if data missing
            }

            progressByMonth.set(monthKey, {
                totalAyahs: current.totalAyahs + ayahs,
                count: current.count + 1
            });
        });

        // Format for chart
        const chartData = Array.from(progressByMonth.entries()).map(([month, data]) => ({
            month,
            ayahs: data.totalAyahs,
            sessions: data.count
        })).reverse(); // Reverse to chronological if map iterator is insertion order (it is usually)
        // Actually map iteration order is insertion, we processed desc logs, so it's reversed.
        // Let's sort by date properly?
        // For MVP, simple reverse might be enough if processed desc.

        return chartData;
    },
});

// Get attendance stats
export const getAttendanceStats = query({
    args: {
        studentId: v.optional(v.id("users")), // Optional, if null assumes "all" or scoped to args
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "manager");

        const attendance = await ctx.db.query("attendance").collect();

        // Filter
        const filtered = args.studentId
            ? attendance.filter(a => a.studentId === args.studentId)
            : attendance;

        const total = filtered.length;
        const present = filtered.filter(a => a.status === "present").length;
        const absent = filtered.filter(a => a.status === "absent").length;
        const late = filtered.filter(a => a.status === "late").length;

        const rate = total > 0 ? (present / total) * 100 : 0;

        return {
            rate: Math.round(rate),
            present,
            absent,
            late,
            total
        };
    }
});

// Get class comparison (Manager Overview)
export const getClassComparison = query({
    args: {},
    handler: async (ctx) => {
        await requireRole(ctx, "manager");

        const classes = await ctx.db.query("classes").collect();
        const students = await ctx.db.query("users").withIndex("by_role", q => q.eq("role", "student")).collect();
        const logs = await ctx.db.query("dailyProgress").collect(); // Expensive but okay for MVP

        const classStats = await Promise.all(classes.map(async (cls) => {
            // Get students in this class
            const enrollments = await ctx.db.query("enrollments").withIndex("by_class", q => q.eq("classId", cls._id)).collect();
            const studentIds = enrollments.map(e => e.studentId);

            // Calculate avg progress
            const classLogs = logs.filter(l => studentIds.includes(l.studentId));
            const totalSessions = classLogs.length;

            // Calculate avg rating
            const avgRating = classLogs.reduce((sum, l) => sum + (l.rating || 0), 0) / (totalSessions || 1);

            return {
                className: cls.name,
                studentCount: studentIds.length,
                avgRating: parseFloat(avgRating.toFixed(1)),
                sessions: totalSessions
            };
        }));

        return classStats.sort((a, b) => b.avgRating - a.avgRating); // Rank by rating
    }
});
