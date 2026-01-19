import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("classes").collect();
    },
});

export const getTeacherClasses = query({
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
            .query("classes")
            .filter((q) => q.eq(q.field("teacherId"), user._id))
            .collect();
    },
});

export const getClassStudents = query({
    args: { classId: v.id("classes") },
    handler: async (ctx, args) => {
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

        return students.filter((s) => s !== null);
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        category: v.string(),
        schedule: v.array(v.object({ day: v.string(), time: v.string() })),
        teacherId: v.optional(v.id("users")),
        subject: v.optional(v.string()), // New field
        description: v.optional(v.string()), // New field
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        // If teacherId is provided (by admin), use it. Otherwise use the creator.
        const teacherId = args.teacherId || user._id;

        const classId = await ctx.db.insert("classes", {
            name: args.name,
            category: args.category,
            schedule: args.schedule,
            teacherId,
            subject: args.subject || "Quran", // Default to Quran
            description: args.description,
        });
        return classId;
    },
});

export const enroll = mutation({
    args: {
        studentId: v.id("users"),
        classId: v.id("classes"),
    },
    handler: async (ctx, args) => {
        // Basic check if already enrolled
        const existing = await ctx.db
            .query("enrollments")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .filter((q) => q.eq(q.field("classId"), args.classId))
            .unique();

        if (existing) return existing._id;

        return await ctx.db.insert("enrollments", {
            studentId: args.studentId,
            classId: args.classId,
            joinedAt: new Date().toISOString(),
            status: "active",
        });
    },
});
