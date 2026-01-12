"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WeeklyCalendar } from "@/components/Schedule/WeeklyCalendar";
import { Calendar as CalendarIcon } from "lucide-react";

export default function SchedulePage() {
    const schedule = useQuery(api.schedule.getMySchedule);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-amiri text-3xl font-bold text-foreground">Weekly Schedule</h1>
                    <p className="text-muted-foreground">Your upcoming Quran circles at a glance.</p>
                </div>
                <div className="rounded-lg bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                    <CalendarIcon className="mr-2 inline-block h-4 w-4" />
                    {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </div>
            </div>

            <div>
                {schedule === undefined ? (
                    <div className="flex h-60 items-center justify-center text-muted-foreground">Loading schedule...</div>
                ) : (
                    <WeeklyCalendar items={schedule} />
                )}
            </div>
        </div>
    );
}
