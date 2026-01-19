import { v } from "convex/values";
// Force rebuild
import { query, mutation } from "./_generated/server";
import { requireRole } from "./permissions";

export const getMyClasses = query({
    args: {},
    handler: async (ctx) => {
        const user = await requireRole(ctx, "teacher");

        // In a real app we'd index this by teacherId. For now, filter.
        const classes = await ctx.db
            .query("classes")
            .filter(q => q.eq(q.field("teacherId"), user._id))
            .collect();

        return classes;
    }
});

export const getClassDetails = query({
    args: { classId: v.id("classes") },
    handler: async (ctx, args) => {
        await requireRole(ctx, "teacher");
        const classData = await ctx.db.get(args.classId);

        // Fetch students via enrollments
        const enrollments = await ctx.db
            .query("enrollments")
            .withIndex("by_class", (q) => q.eq("classId", args.classId))
            .collect();

        const students = await Promise.all(
            enrollments.map(async (e) => {
                const student = await ctx.db.get(e.studentId);
                return student;
            })
        );

        return {
            ...classData,
            students: students.filter((s) => s !== null)
        };
    }
});

export const logProgress = mutation({
    args: {
        studentId: v.id("users"),
        classId: v.id("classes"),
        // Quran Fields (Optional)
        surahName: v.optional(v.string()),
        ayahStart: v.optional(v.number()),
        ayahEnd: v.optional(v.number()),
        // Generic Fields (Optional)
        topic: v.optional(v.string()),
        score: v.optional(v.number()),
        // Common Fields
        rating: v.number(),
        notes: v.optional(v.string()),
        status: v.string(), // "Passed", "Needs Review", "Failed"
    },
    handler: async (ctx, args) => {
        const user = await requireRole(ctx, "teacher");

        return await ctx.db.insert("dailyProgress", {
            ...args,
            teacherId: user._id,
            date: new Date().toISOString().split('T')[0],
        });
    },
});

export const getStudentProgressHistory = query({
    args: { studentId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("dailyProgress")
            .withIndex("by_student_date", (q) => q.eq("studentId", args.studentId))
            .order("desc")
            .collect();
    },
});
