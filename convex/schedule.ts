import { v } from "convex/values";
import { query } from "./_generated/server";

export const getMySchedule = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        // For now, we fetch ALL classes. 
        // In a real app, we would filter by:
        // 1. Classes I teach (if teacher)
        // 2. Classes I am enrolled in (if student) - requires 'enrollments' table which we haven't fully populated yet

        const classes = await ctx.db.query("classes").collect();

        // Flatten classes into schedule items
        const scheduleItems: any[] = [];

        classes.forEach((c) => {
            c.schedule.forEach((s: any) => {
                scheduleItems.push({
                    _id: c._id + "-" + s.day + "-" + s.time, // simplistic unique key
                    day: s.day,
                    time: s.time,
                    className: c.name,
                    classId: c._id,
                    category: c.category
                });
            });
        });

        return scheduleItems;
    },
});
