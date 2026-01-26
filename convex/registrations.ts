import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { hasAnyRole } from "./permissions";

// Public mutation for submitting the enrollment form
export const submit = mutation({
    args: {
        parentName: v.string(),
        email: v.string(),
        phone: v.string(),
        studentName: v.string(),
        age: v.number(),
        plan: v.string(),
    },
    handler: async (ctx, args) => {
        // Save the new registration
        await ctx.db.insert("registrations", {
            ...args,
            status: "new",
            submittedAt: new Date().toISOString(),
        });
    },
});

// Admin/Staff query to get all registrations
export const get = query({
    handler: async (ctx) => {
        return await ctx.db.query("registrations").order("desc").collect();
    },
});

// Alias for API consistency
export const list = get;

// Admin mutation to update status
export const updateStatus = mutation({
    args: {
        id: v.id("registrations"),
        status: v.string(), // "contacted", "enrolled", "archived"
        notes: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { id, status, notes } = args;
        await ctx.db.patch(id, {
            status,
            ...(notes ? { notes } : {}) // Update notes only if provided
        });
    },
});

export const confirmEnrollment = mutation({
    args: {
        id: v.id("registrations"),
        role: v.string(), // "student" | "teacher"
    },
    handler: async (ctx, args) => {
        const { id, role } = args;
        const registration = await ctx.db.get(id);
        if (!registration) throw new Error("Registration not found");

        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");

        if (role === "student") {
            // 1. Create Student User
            const studentId = await ctx.db.insert("users", {
                name: registration.studentName,
                role: "student",
                clerkId: `pending_${registration.studentName}_${Date.now()}`,
                email: registration.email,
                phone: registration.phone,
            });

            // 2. Create Parent Invitation
            await ctx.db.insert("invitations", {
                email: registration.email,
                phone: registration.phone,
                role: "parent",
                status: "pending",
                invitedAt: new Date().toISOString(),
                studentName: registration.studentName,
                studentId: studentId
            });
        } else if (role === "teacher") {
            await ctx.db.insert("invitations", {
                email: registration.email,
                phone: registration.phone,
                role: "teacher",
                status: "pending",
                invitedAt: new Date().toISOString(),
                studentName: registration.studentName,
            });
        }

        // 3. Mark registration as enrolled
        await ctx.db.patch(id, { status: "enrolled" });
    }
});
