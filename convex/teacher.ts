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

        // Mocking students for now since we don't have full enrollment logic yet
        // In reality: db.query("enrollments").withIndex("by_class", q => q.eq("classId", args.classId)).collect()
        // Then map to users.

        // Let's fetch ALL students as a temporary mock so the teacher sees someone
        const mockStudents = await ctx.db.query("users").filter(q => q.eq(q.field("role"), "student")).take(10);

        return {
            ...classData,
            students: mockStudents
        };
    }
});
