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
