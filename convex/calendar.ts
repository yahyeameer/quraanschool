import { v } from "convex/values";
import { query } from "./_generated/server";

export const getEvents = query({
    args: {
        start: v.number(), // timestamp
        end: v.number(),   // timestamp
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return [];

        // 1. Get Exams (One-time events)
        // Assuming exams have a `date` field as ISO string
        const exams = await ctx.db.query("exams").collect();
        const examEvents = exams
            .filter((exam) => {
                const examDate = new Date(exam.date).getTime();
                return examDate >= args.start && examDate <= args.end;
            })
            .map((exam) => ({
                id: exam._id,
                title: `Exam: ${exam.title}`,
                start: new Date(exam.date).toISOString(),
                end: new Date(new Date(exam.date).getTime() + 2 * 60 * 60 * 1000).toISOString(), // Assume 2 hours
                type: "exam",
                classId: exam.classId,
            }));

        // 2. Get Classes (Recurring events)
        // We need to filter classes relevant to the user
        let relevantClasses: any[] = [];
        if (user.role === "teacher") {
            relevantClasses = await ctx.db
                .query("classes")
                .filter((q) => q.eq(q.field("teacherId"), user._id))
                .collect();
        } else if (user.role === "student") {
            // Find enrollments
            const enrollments = await ctx.db
                .query("enrollments")
                .withIndex("by_student", q => q.eq("studentId", user._id))
                .collect();
            const classIds = enrollments.map(e => e.classId);
            // Fetch classes manually (or assume we have a way to fetch many)
            // For MVP fetch all classes and filter
            const allClasses = await ctx.db.query("classes").collect();
            relevantClasses = allClasses.filter(c => classIds.includes(c._id));
        } else if (user.role === "parent") {
            // Similar to student but for children
            // Omitted for brevity, can fallback to empty or implement if needed
            relevantClasses = [];
        } else {
            // Manager/Admin sees all
            relevantClasses = await ctx.db.query("classes").collect();
        }

        // Expand recurring schedule into events
        const classEvents: any[] = [];
        const startDate = new Date(args.start);
        const endDate = new Date(args.end);

        relevantClasses.forEach((cls) => {
            if (!cls.schedule) return;

            // cls.schedule is array of { day: string, time: string }
            // day: "Monday", "Tuesday", etc.
            cls.schedule.forEach((slot: any) => {
                // Iterate through days in range
                let current = new Date(startDate);
                while (current <= endDate) {
                    const dayName = current.toLocaleDateString('en-US', { weekday: 'long' });
                    if (dayName === slot.day) {
                        // Construct event time
                        // slot.time likely "10:00" or "10:00 AM"
                        // Need robust parsing, assume "HH:MM" for MVP 24hr
                        const [hours, minutes] = slot.time.split(":").map((n: string) => parseInt(n));
                        const eventStart = new Date(current);
                        eventStart.setHours(hours, minutes || 0, 0, 0);

                        const eventEnd = new Date(eventStart);
                        eventEnd.setHours(eventStart.getHours() + 1); // Assume 1 hour duration

                        classEvents.push({
                            id: `${cls._id}-${current.toISOString()}`,
                            title: cls.name,
                            start: eventStart.toISOString(),
                            end: eventEnd.toISOString(),
                            type: "class",
                            classId: cls._id,
                            color: "bg-emerald-500" // UI helper
                        });
                    }
                    current.setDate(current.getDate() + 1);
                }
            });
        });

        return [...examEvents, ...classEvents];
    },
});
