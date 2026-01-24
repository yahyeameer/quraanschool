import { QueryCtx, MutationCtx } from "./_generated/server";

// Define all valid roles for type safety
export type UserRole = "admin" | "manager" | "teacher" | "staff" | "accountant" | "librarian" | "receptionist" | "parent" | "student" | "guest";

export async function hasRole(ctx: QueryCtx | MutationCtx, role: UserRole) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { hasRole: false, user: null };

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .unique();

    if (!user) return { hasRole: false, user: null };

    // Validate that user has a proper role
    if (!isValidRole(user.role)) {
        console.error(`Invalid role detected: ${user.role} for user: ${user.clerkId}`);
        return { hasRole: false, user: null };
    }

    // Admin has access to everything
    if (user.role === "admin") return { hasRole: true, user };

    // Manager has most access except admin-only functions
    if (user.role === "manager" && role !== "admin") return { hasRole: true, user };

    // Role-specific checks
    if (user.role === role) return { hasRole: true, user };

    return { hasRole: false, user };
}

export async function requireRole(ctx: QueryCtx | MutationCtx, role: UserRole) {
    const { hasRole: isAuthorized, user } = await hasRole(ctx, role);
    if (!isAuthorized || !user) {
        throw new Error(`Unauthorized: Requires ${role} role`);
    }
    return user;
}

// Helper function to validate roles
function isValidRole(role: string): role is UserRole {
    return ["admin", "manager", "teacher", "staff", "accountant", "librarian", "receptionist", "parent", "student", "guest"].includes(role);
}

// Check if user has any of the specified roles
export async function hasAnyRole(ctx: QueryCtx | MutationCtx, roles: UserRole[]) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { hasRole: false, user: null };

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .unique();

    if (!user || !isValidRole(user.role)) return { hasRole: false, user: null };

    const hasAnyRequiredRole = roles.includes(user.role);
    return { hasRole: hasAnyRequiredRole, user };
}
