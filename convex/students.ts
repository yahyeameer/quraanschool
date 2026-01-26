import { v } from "convex/values";
import { query } from "./_generated/server";
import { hasAnyRole } from "./permissions";

export const listEnrolled = query({
    args: {},
    handler: async (ctx) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager", "staff"]);
        if (!hasRole) return []; // Or throw

        const students = await ctx.db.query("users")
            .withIndex("by_role", q => q.eq("role", "student"))
            .collect();

        // Enhance with Parent Info + Reg Info
        const result = await Promise.all(students.map(async (student) => {
            let parent = null;
            if (student.parentId) {
                parent = await ctx.db.get(student.parentId);
            }
            // fallback to registration info if parent user not found or not linked yet
            // logic could be added here to search registrations by email if needed

            return {
                ...student,
                parentName: parent?.name,
                parentPhone: parent?.phone,
                parentEmail: parent?.email,
            };
        }));

        return result;
    }
});

export const getProfile = query({
    args: { studentId: v.id("users") },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager", "staff", "parent", "teacher"]);
        if (!hasRole) return null;

        const student = await ctx.db.get(args.studentId);
        if (!student || student.role !== "student") return null;

        // 1. Get Parent Info
        let parent = null;
        if (student.parentId) {
            parent = await ctx.db.get(student.parentId);
        }

        // 2. Get Enrollments & Classes
        const enrollments = await ctx.db.query("enrollments")
            .withIndex("by_student", q => q.eq("studentId", student._id))
            .collect();

        const classesWithDetails = await Promise.all(enrollments.map(async (e) => {
            const classData = await ctx.db.get(e.classId);
            return {
                ...e,
                classData
            };
        }));

        // 3. Get Recent Progress (Last 10 entries)
        const progress = await ctx.db.query("dailyProgress")
            .withIndex("by_student_date", q => q.eq("studentId", student._id))
            .order("desc")
            .take(10);

        // 4. Get Attendance Stats (Simple Count)
        const attendance = await ctx.db.query("attendance")
            .withIndex("by_student", q => q.eq("studentId", student._id))
            .collect();

        const attendanceStats = {
            total: attendance.length,
            present: attendance.filter(a => a.status === "present").length,
            absent: attendance.filter(a => a.status === "absent").length,
            late: attendance.filter(a => a.status === "late").length,
        };

        // 5. Get Student Stats (Gamification)
        const stats = await ctx.db.query("student_stats")
            .withIndex("by_student", q => q.eq("studentId", student._id))
            .first();

        return {
            student,
            stats,
            parent,
            classes: classesWithDetails,
            recentProgress: progress,
            attendanceStats
        };
    }
});
