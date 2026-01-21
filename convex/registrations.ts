import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
        // Optionally add auth check here later (UserIdentity check)
        // For now, we assume this is called from a protected dashboard page
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
