import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasAnyRole } from "./permissions";

// --- Route Management ---

export const listRoutes = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("transport_routes").collect();
    }
});

export const getRouteDetails = query({
    args: { routeId: v.id("transport_routes") },
    handler: async (ctx, args) => {
        const route = await ctx.db.get(args.routeId);
        if (!route) return null;

        const stops = await ctx.db.query("transport_stops")
            .withIndex("by_route", q => q.eq("routeId", args.routeId))
            .collect();

        const driver = route.driverId ? await ctx.db.get(route.driverId) : null;

        return {
            ...route,
            stops: stops.sort((a, b) => a.order - b.order),
            driverName: driver?.name
        };
    }
});

export const createRoute = mutation({
    args: {
        name: v.string(),
        driverId: v.optional(v.id("users")),
        vehiclePlate: v.string(),
        capacity: v.number(),
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");

        return await ctx.db.insert("transport_routes", {
            ...args,
            status: "garage",
        });
    }
});

export const updateRouteStatus = mutation({
    args: {
        routeId: v.id("transport_routes"),
        status: v.string(), // "garage", "en-route", "completed"
        lat: v.optional(v.number()),
        lng: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // Allow driver or manager
        const { hasRole, user } = await hasAnyRole(ctx, ["admin", "manager", "staff"]);
        if (!hasRole) throw new Error("Unauthorized");

        const update: any = { status: args.status, lastUpdated: new Date().toISOString() };
        if (args.lat && args.lng) {
            update.currentLocation = { lat: args.lat, lng: args.lng };
        }

        await ctx.db.patch(args.routeId, update);
    }
});

// --- Assignments ---

export const assignStudent = mutation({
    args: {
        studentId: v.id("users"),
        routeId: v.id("transport_routes"),
        stopId: v.optional(v.id("transport_stops")),
        type: v.string(), // "pickup", "dropoff", "both"
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");

        // Check if existing assignment exists? For now we allow multiple or replace logic
        const existing = await ctx.db.query("transport_assignments")
            .withIndex("by_student", q => q.eq("studentId", args.studentId))
            .filter(q => q.eq(q.field("routeId"), args.routeId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                stopId: args.stopId,
                type: args.type
            });
        } else {
            await ctx.db.insert("transport_assignments", args);
        }
    }
});

// --- Parent Queries ---

export const getStudentTransport = query({
    args: { studentId: v.id("users") },
    handler: async (ctx, args) => {
        // Verify parent owns this student? Or rely on manager usage.
        // For simplicity allow any authorized user view for now, or check parent relationship

        const assignment = await ctx.db.query("transport_assignments")
            .withIndex("by_student", q => q.eq("studentId", args.studentId))
            .first(); // Assuming one primary route for simplicity

        if (!assignment) return null;

        const route = await ctx.db.get(assignment.routeId);
        const driver = route?.driverId ? await ctx.db.get(route.driverId) : null;

        return {
            assignment,
            route,
            driverName: driver?.name,
            driverPhone: driver?.phone
        };
    }
});
