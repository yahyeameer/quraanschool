import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get the organization settings
export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("organization_settings").first();
    return settings;
  },
});

// Update or insert organization settings
export const update = mutation({
  args: {
    name: v.string(),
    about: v.string(),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("organization_settings").first();
    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        about: args.about,
        logoUrl: args.logoUrl,
        updatedAt: now,
      });
      return existing._id;
    } else {
      const newId = await ctx.db.insert("organization_settings", {
        name: args.name,
        about: args.about,
        logoUrl: args.logoUrl,
        updatedAt: now,
      });
      return newId;
    }
  },
});
