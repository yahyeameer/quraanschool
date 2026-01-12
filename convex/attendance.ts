import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole } from "./permissions";

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
        } else {
            await ctx.db.insert("attendance", {
                studentId: args.studentId,
                classId: args.classId,
                date: args.date,
                status: args.status
            });
        }
    },
});
