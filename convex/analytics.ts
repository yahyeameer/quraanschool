import { v } from "convex/values";
import { query } from "./_generated/server";
import { hasAnyRole } from "./permissions";

export const getAcademicVelocity = query({
    args: {},
    handler: async (ctx) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "manager"]);
        if (!hasRole) return [];

        // Aggregate progress
        // We will look at 'tracker_logs' (Ayah memorization) or 'dailyProgress'
        // Let's use tracker_logs for "Ayahs Memorized" velocity

        const logs = await ctx.db.query("tracker_logs").collect();

        // Group by Month (last 6 months)
        const months: Record<string, number> = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${monthNames[d.getMonth()]}`;
            months[key] = 0;
        }

        logs.forEach(log => {
            const d = new Date(log.date);
            const key = `${monthNames[d.getMonth()]}`;
            if (months[key] !== undefined) {
                // Calculate ayahs count
                const count = (log.ayahEnd - log.ayahStart) + 1;
                months[key] += count;
            }
        });

        // Format for Recharts
        const result = Object.entries(months).map(([name, value]) => ({
            name,
            value
        }));

        // If empty data (new system), return mock/zeros or null to handle gracefully
        // Return zeros structure at least
        return result;
    }
});
