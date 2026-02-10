"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WeeklyCalendar } from "@/components/Schedule/WeeklyCalendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Printer } from "lucide-react";

export default function SchedulePage() {
    const schedule = useQuery(api.schedule.getMySchedule);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-amiri text-3xl font-bold text-foreground">Weekly Schedule</h1>
                    <p className="text-muted-foreground">Your upcoming Quran circles at a glance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="print:hidden gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        Print Schedule
                    </Button>
                    <div className="rounded-lg bg-accent px-3 py-1 text-sm font-medium text-accent-foreground print:hidden">
                        <CalendarIcon className="mr-2 inline-block h-4 w-4" />
                        {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>

            <div className="print:w-full print:absolute print:top-0 print:left-0">
                {schedule === undefined ? (
                    <div className="flex h-60 items-center justify-center text-muted-foreground">Loading schedule...</div>
                ) : (
                    <WeeklyCalendar items={schedule} />
                )}
            </div>
        </div>
    );
}
