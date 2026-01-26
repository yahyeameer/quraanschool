import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole, hasAnyRole } from "./permissions";

// --- Attendance Management ---

export const markAttendance = mutation({
    args: {
        classId: v.id("classes"),
        date: v.string(),
        records: v.array(v.object({
            studentId: v.id("users"),
            status: v.string() // "present", "absent", "late"
        }))
    },
    handler: async (ctx, args) => {
        // Allow teachers and admins
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new Error("Unauthorized");

        // In a real app, verify the teacher owns the class or is admin
        // For MVP, just checking if they are logged in and have role
        // fetching user role... simplified here:

        // Process each record
        for (const record of args.records) {
            // Check for existing record to update or insert
            const existing = await ctx.db
                .query("attendance")
                .withIndex("by_class_date", q => q.eq("classId", args.classId).eq("date", args.date))
                .filter(q => q.eq(q.field("studentId"), record.studentId))
                .unique();

            if (existing) {
                await ctx.db.patch(existing._id, { status: record.status });
            } else {
                await ctx.db.insert("attendance", {
                    classId: args.classId,
                    date: args.date,
                    studentId: record.studentId,
                    status: record.status
                });
            }
        }
    }
});

export const getAttendanceByDate = query({
    args: { classId: v.id("classes"), date: v.string() },
    handler: async (ctx, args) => {
        const records = await ctx.db
            .query("attendance")
            .withIndex("by_class_date", q => q.eq("classId", args.classId).eq("date", args.date))
            .collect();
        return records;
    }
});

// --- Exam Management ---

export const createExam = mutation({
    args: {
        classId: v.id("classes"),
        title: v.string(),
        subject: v.string(),
        date: v.string(),
        totalMarks: v.number(),
        description: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "teacher"); // Or manager/admin via internal check logic

        return await ctx.db.insert("exams", {
            ...args,
            status: "scheduled"
        });
    }
});

export const getExams = query({
    args: { classId: v.optional(v.id("classes")) },
    handler: async (ctx, args) => {
        // If classId provided, filter by it. Otherwise return all (for manager overview)
        // Simplified: fetching all for now if no classId
        if (args.classId) {
            return await ctx.db
                .query("exams")
                .withIndex("by_class", q => q.eq("classId", args.classId!))
                .order("desc")
                .collect();
        }
        return await ctx.db.query("exams").collect();
    }
});

export const submitExamResults = mutation({
    args: {
        examId: v.id("exams"),
        results: v.array(v.object({
            studentId: v.id("users"),
            marksObtained: v.number(),
            notes: v.optional(v.string())
        }))
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "teacher");

        for (const result of args.results) {
            const existing = await ctx.db
                .query("exam_results")
                .withIndex("by_exam", q => q.eq("examId", args.examId))
                .filter(q => q.eq(q.field("studentId"), result.studentId))
                .unique();

            if (existing) {
                await ctx.db.patch(existing._id, {
                    marksObtained: result.marksObtained,
                    notes: result.notes
                });
            } else {
                await ctx.db.insert("exam_results", {
                    examId: args.examId,
                    studentId: result.studentId,
                    marksObtained: result.marksObtained,
                    notes: result.notes
                });
            }
        }

        // Mark exam as completed
        await ctx.db.patch(args.examId, { status: "completed" });
    }
});

export const getExamResults = query({
    args: { examId: v.id("exams") },
    handler: async (ctx, args) => {
        const results = await ctx.db
            .query("exam_results")
            .withIndex("by_exam", q => q.eq("examId", args.examId))
            .collect();

        // Enrich with student names
        const enriched = await Promise.all(results.map(async (r) => {
            const student = await ctx.db.get(r.studentId);
            return {
                ...r,
                studentName: student?.name || "Unknown"
            };
        }));

        return enriched;
    }
});

// --- Subject & Course of Study Management ---

export const listSubjects = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("subjects").collect();
    }
});

export const getCourseOfStudy = query({
    args: { subjectId: v.id("subjects") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("course_of_study")
            .withIndex("by_subject", q => q.eq("subjectId", args.subjectId))
            .collect();
    }
});

export const addSubject = mutation({
    args: {
        name: v.string(),
        code: v.string(),
        category: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");
        return await ctx.db.insert("subjects", args);
    }
});

export const addCourseItem = mutation({
    args: {
        subjectId: v.id("subjects"),
        title: v.string(),
        level: v.string(),
        description: v.optional(v.string()),
        books: v.array(v.object({
            title: v.string(),
            author: v.optional(v.string()),
            link: v.optional(v.string())
        })),
        topics: v.array(v.string())
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");
        return await ctx.db.insert("course_of_study", args);
    }
});
