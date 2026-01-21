import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireRole } from "./permissions";

export const getSummary = query({
    args: {},
    handler: async (ctx) => {
        const user = await requireRole(ctx, "manager");
        if (!user && (await requireRole(ctx, "admin")) === null) return null;

        // Fetch recent payments (last 6 months ideally, but fetching all for now for MVP)
        const payments = await ctx.db.query("payments").collect();
        const attendance = await ctx.db.query("attendance").collect();

        // Helper to format month
        const getMonth = (dateStr: string) => {
            const date = new Date(dateStr);
            return date.toLocaleString('default', { month: 'short' });
        };

        // Aggregate Data
        const monthlyData = new Map<string, { attendanceCount: number; totalAttendance: number; payments: number }>();

        // Init last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const month = d.toLocaleString('default', { month: 'short' });
            monthlyData.set(month, { attendanceCount: 0, totalAttendance: 0, payments: 0 });
        }

        // Process Payments
        payments.forEach(p => {
            if (p.status === "paid") {
                const month = getMonth(p.date);
                if (monthlyData.has(month)) {
                    const current = monthlyData.get(month)!;
                    current.payments += p.amount;
                }
            }
        });

        // Process Attendance
        attendance.forEach(a => {
            const month = getMonth(a.date);
            if (monthlyData.has(month)) {
                const current = monthlyData.get(month)!;
                current.totalAttendance++; // Total records
                if (a.status === "present" || a.status === "late") {
                    current.attendanceCount++; // Present count
                }
            }
        });

        // Format for Recharts
        const chartData = Array.from(monthlyData.entries()).map(([name, data]) => ({
            name,
            attendance: data.totalAttendance > 0 ? Math.round((data.attendanceCount / data.totalAttendance) * 100) : 0,
            payments: data.payments
        }));

        return chartData;
    }
});
