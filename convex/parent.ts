import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireRole } from "./permissions";

export const getChildren = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const parent = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!parent || parent.role !== "parent") return [];

        const children = await ctx.db
            .query("users")
            .withIndex("by_parent", (q) => q.eq("parentId", parent._id))
            .collect();

        return children;
    },
});

export const getChildDashboardData = query({
    args: { studentId: v.id("users") },
    handler: async (ctx, args) => {
        const student = await ctx.db.get(args.studentId);
        if (!student) return null;

        // 1. Get Class Info (Active Enrollment)
        const enrollment = await ctx.db
            .query("enrollments")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .filter(q => q.eq(q.field("status"), "active"))
            .first();

        let currentClass = null;
        if (enrollment) {
            currentClass = await ctx.db.get(enrollment.classId);
        }

        // 2. Fetch Recent Exams & Results
        const examResults = await ctx.db
            .query("exam_results")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .order("desc")
            .take(5);

        const examsWithDetails = await Promise.all(
            examResults.map(async (result) => {
                const exam = await ctx.db.get(result.examId);
                return {
                    ...result,
                    examTitle: exam?.title || "Unknown Exam",
                    totalMarks: exam?.totalMarks || 100,
                    date: exam?.date || "",
                    subject: exam?.subject || ""
                };
            })
        );

        // Fetch recent progress
        const progress = await ctx.db
            .query("dailyProgress")
            .withIndex("by_student_date", (q) => q.eq("studentId", args.studentId))
            .order("desc")
            .take(5);

        // Fetch recent attendance
        const attendance = await ctx.db
            .query("attendance")
            .filter(q => q.eq(q.field("studentId"), args.studentId))
            // .order("desc") // Filter doesn't support order directly on non-indexed field effectively in all cases, but let's try or do in memory if needed. 
            // Actually, for simple filter, typically we want an index. `by_student` is index.
            // Let's use the index for attendance to be safe and efficient
            .withIndex("by_student", q => q.eq("studentId", args.studentId))
            .order("desc")
            .take(10);

        // Fetch pending/recent payments
        const payments = await ctx.db
            .query("payments")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .order("desc")
            .take(5);

        return {
            student,
            currentClass,
            exams: examsWithDetails,
            progress,
            attendance,
            payments
        };
    },
});
