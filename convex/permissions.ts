import { QueryCtx, MutationCtx } from "./_generated/server";

export async function hasRole(ctx: QueryCtx | MutationCtx, role: "admin" | "teacher") {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { hasRole: false, user: null };

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .unique();

    if (!user) return { hasRole: false, user: null };

    // Admin has access to everything
    if (user.role === "admin") return { hasRole: true, user };

    // Teacher check
    if (role === "teacher" && user.role === "teacher") return { hasRole: true, user };

    return { hasRole: false, user };
}

export async function requireRole(ctx: QueryCtx | MutationCtx, role: "admin" | "teacher") {
    const { hasRole: isAuthorized, user } = await hasRole(ctx, role);
    if (!isAuthorized || !user) {
        throw new Error(`Unauthorized: Requires ${role} role`);
    }
    return user;
}
