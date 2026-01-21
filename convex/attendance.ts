import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole, hasAnyRole } from "./permissions";

// Log attendance for a student
export const logAttendance = mutation({
    args: {
        studentId: v.id("users"),
        classId: v.id("classes"),
        date: v.string(),
        status: v.string(), // "present" | "absent" | "late"
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "teacher");

        // Check if attendance exists for this date/student/class
        const existing = await ctx.db
            .query("attendance")
            .withIndex("by_class_date", (q) => q.eq("classId", args.classId).eq("date", args.date))
            .filter(q => q.eq(q.field("studentId"), args.studentId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { status: args.status });
            return existing._id;
        } else {
            return await ctx.db.insert("attendance", {
                studentId: args.studentId,
                classId: args.classId,
                date: args.date,
                status: args.status
            });
        }
    },
});

// Get attendance for a specific class and date
export const getClassAttendance = query({
    args: {
        classId: v.id("classes"),
        date: v.string()
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["teacher", "admin", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");

        return await ctx.db
            .query("attendance")
            .withIndex("by_class_date", (q) => q.eq("classId", args.classId).eq("date", args.date))
            .collect();
    },
});

// Get attendance history for a student
export const getStudentAttendance = query({
    args: { studentId: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db
            .query("attendance")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .order("desc")
            .collect();
    },
});

// Get attendance summary for a date (admin dashboard)
export const getAttendanceSummary = query({
    args: { date: v.string() },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");

        const records = await ctx.db
            .query("attendance")
            .withIndex("by_date", (q) => q.eq("date", args.date))
            .collect();

        const present = records.filter(r => r.status === "present").length;
        const absent = records.filter(r => r.status === "absent").length;
        const late = records.filter(r => r.status === "late").length;

        return {
            total: records.length,
            present,
            absent,
            late,
            presentPercentage: records.length > 0 ? Math.round((present / records.length) * 100) : 0
        };
    },
});

// Bulk log attendance for multiple students
export const bulkLogAttendance = mutation({
    args: {
        classId: v.id("classes"),
        date: v.string(),
        attendance: v.array(v.object({
            studentId: v.id("users"),
            status: v.string()
        }))
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "teacher");

        for (const record of args.attendance) {
            const existing = await ctx.db
                .query("attendance")
                .withIndex("by_class_date", (q) => q.eq("classId", args.classId).eq("date", args.date))
                .filter(q => q.eq(q.field("studentId"), record.studentId))
                .unique();

            if (existing) {
                await ctx.db.patch(existing._id, { status: record.status });
            } else {
                await ctx.db.insert("attendance", {
                    studentId: record.studentId,
                    classId: args.classId,
                    date: args.date,
                    status: record.status
                });
            }
        }
    },
});
