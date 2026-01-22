"use client";

import { RoleGuard } from "@/components/Auth/RoleGuard";
import { StudentAnalytics } from "@/components/Analytics/StudentAnalytics";
import { Activity } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-8">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent italic flex items-center gap-3">
                        <Activity className="h-8 w-8 text-blue-500" />
                        Analytics Dashboard
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Insights into student performance, attendance, and class rankings.
                    </p>
                </div>

                <StudentAnalytics />
            </div>
        </RoleGuard>
    );
}
