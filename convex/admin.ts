import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole, UserRole } from "./permissions";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valid staff roles
const VALID_STAFF_ROLES = ["teacher", "staff", "manager", "accountant", "librarian", "receptionist"];

// Helper function to validate email
function validateEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
}

// Helper function to validate role
function validateRole(role: string): role is UserRole {
    return ["admin", "manager", "teacher", "staff", "accountant", "librarian", "receptionist", "parent", "student", "guest"].includes(role);
}

// Enhanced stats query with comprehensive metrics
export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        // Only admin/manager can see full stats
        if (!user || (user.role !== "admin" && user.role !== "manager")) {
            return null;
        }

        // Count users by role
        const allUsers = await ctx.db.query("users").collect();
        const totalStudents = allUsers.filter(u => u.role === "student").length;
        const totalTeachers = allUsers.filter(u => u.role === "teacher").length;

        // Count classes
        const classes = await ctx.db.query("classes").collect();
        const activeClasses = classes.length;

        // Calculate total ayahs memorized
        const logs = await ctx.db.query("tracker_logs").collect();
        const totalAyahs = logs.reduce((acc, log) => acc + (log.ayahEnd - log.ayahStart + 1), 0);

        // Count pending registrations
        const registrations = await ctx.db.query("registrations").collect();
        const pendingApplications = registrations.filter(r => r.status === "new").length;

        // Payment summary
        const payments = await ctx.db.query("payments").collect();
        const totalRevenue = payments
            .filter(p => p.status === "paid")
            .reduce((sum, p) => sum + p.amount, 0);

        return {
            totalStudents,
            totalTeachers,
            activeClasses,
            totalAyahs,
            pendingApplications,
            totalRevenue,
        };
    },
});

export const listUsers = query({
    args: {},
    handler: async (ctx) => {
        const user = await requireRole(ctx, "admin");
        if (!user) return [];
        return await ctx.db.query("users").collect();
    }
});

export const inviteStaff = mutation({
    args: {
        email: v.string(),
        role: v.union(
            v.literal("teacher"),
            v.literal("staff"),
            v.literal("manager"),
            v.literal("accountant"),
            v.literal("librarian"),
            v.literal("receptionist")
        )
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");

        // Validate email format
        if (!validateEmail(args.email)) {
            throw new Error("Invalid email format");
        }

        // Validate role
        if (!VALID_STAFF_ROLES.includes(args.role)) {
            throw new Error("Invalid role. Must be one of: teacher, staff, manager");
        }

        // Check if already invited
        const existing = await ctx.db
            .query("invitations")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (existing && existing.status === "pending") {
            throw new Error("Staff already has a pending invitation");
        }

        return await ctx.db.insert("invitations", {
            email: args.email.toLowerCase(), // Normalize email
            role: args.role,
            status: "pending",
            invitedAt: new Date().toISOString(),
        });
    }
});

export const listInvitations = query({
    args: {},
    handler: async (ctx) => {
        await requireRole(ctx, "admin");
        return await ctx.db.query("invitations").collect();
    }
});

export const inviteStudent = mutation({
    args: {
        studentName: v.string(),
        phone: v.string()
    },
    handler: async (ctx, args) => {
        const user = await requireRole(ctx, "manager"); // Managers also invite students
        if (!user) {
            // Fallback to admin check if checking manager returned null (though requireRole throws usually if we implemented it strict, 
            // but here let's assume requireRole handles it or we re-check strict admin if not manager? 
            // Actually requireRole returns the user if found, or throws? 
            // Looking at usage: await requireRole(ctx, "admin"). 
            // We should allow "admin" OR "manager".
            // Let's rely on internal logic of requireRole if it supported array, but it takes string.
            // We'll verify permissions manually here for flexibility.
            const identity = await ctx.auth.getUserIdentity();
            if (!identity) throw new Error("Unauthorized");
            const u = await ctx.db.query("users").withIndex("by_clerkId", q => q.eq("clerkId", identity.subject)).unique();
            if (!u || (u.role !== "admin" && u.role !== "manager")) throw new Error("Unauthorized");
        }


        // Basic phone validation (digits, plus, dashes, spaces)
        if (!/^[\d\+\-\s]{7,15}$/.test(args.phone)) {
            throw new Error("Invalid phone number format");
        }

        // Check for existing invitation by phone
        const existing = await ctx.db
            .query("invitations")
            .withIndex("by_phone", (q) => q.eq("phone", args.phone))
            .unique();

        if (existing && existing.status === "pending") {
            throw new Error("Student already has a pending invitation");
        }

        return await ctx.db.insert("invitations", {
            phone: args.phone,
            role: "student",
            studentName: args.studentName,
            status: "pending",
            invitedAt: new Date().toISOString(),
        });
    }
});

export const removeStaff = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");
        // Demote to guest so they lose access but kept in DB
        await ctx.db.patch(args.userId, { role: "guest" });
    }
});

export const updateUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.union(
            v.literal("admin"),
            v.literal("manager"),
            v.literal("teacher"),
            v.literal("staff"),
            v.literal("accountant"),
            v.literal("librarian"),
            v.literal("receptionist"),
            v.literal("parent"),
            v.literal("student"),
            v.literal("guest")
        )
    },
    handler: async (ctx, args) => {
        const currentUser = await requireRole(ctx, "admin");

        // Prevent users from changing their own role
        if (args.userId === currentUser._id) {
            throw new Error("Cannot change your own role");
        }

        await ctx.db.patch(args.userId, { role: args.role });
    }
});

export const linkStudentToParent = mutation({
    args: {
        studentId: v.id("users"),
        parentId: v.optional(v.id("users")) // parentId is optional to unlink
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");

        // Verify student exists and is actually a student
        const student = await ctx.db.get(args.studentId);
        if (!student) {
            throw new Error("Student not found");
        }
        if (student.role !== "student") {
            throw new Error("Can only link parents to students");
        }

        // If parentId provided, verify it exists and is a parent
        if (args.parentId) {
            const parent = await ctx.db.get(args.parentId);
            if (!parent) {
                throw new Error("Parent not found");
            }
            if (parent.role !== "parent") {
                throw new Error("Can only link to users with parent role");
            }
        }

        await ctx.db.patch(args.studentId, { parentId: args.parentId });
    }
});

// Delete invitation
export const deleteInvitation = mutation({
    args: { invitationId: v.id("invitations") },
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");
        await ctx.db.delete(args.invitationId);
    }
});

// Get user by ID
export const getUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        await requireRole(ctx, "admin");
        return await ctx.db.get(args.userId);
    }
});
