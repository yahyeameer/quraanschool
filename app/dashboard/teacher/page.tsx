"use client";

import { AttendanceMarker } from "@/components/Teacher/AttendanceMarker";
import { ProgressLogbook } from "@/components/Teacher/ProgressLogbook";
import { AssignmentManager } from "@/components/Teacher/AssignmentManager";
import { RoleGuard } from "@/components/Auth/RoleGuard";

export default function TeacherDashboard() {
    return (
        <RoleGuard requiredRole="teacher">
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
                    <p className="text-muted-foreground">Manage your halaqas and track student progress.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <AttendanceMarker />
                    <ProgressLogbook />
                    <AssignmentManager />
                </div>
            </div>
        </RoleGuard>
    );
}
