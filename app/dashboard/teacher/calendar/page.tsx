"use client";

import { RoleGuard } from "@/components/Auth/RoleGuard";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
    return (
        <RoleGuard requiredRole={["teacher", "manager", "admin", "student"]}>
            <div className="container max-w-6xl py-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <CalendarIcon className="h-8 w-8 text-pink-600" />
                        Schedule & Events
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        View upcoming classes, exams, and academic events.
                    </p>
                </div>

                <CalendarView />
            </div>
        </RoleGuard>
    );
}
