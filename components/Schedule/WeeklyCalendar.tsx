"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface ScheduleItem {
    _id: string;
    day: string;
    time: string;
    className: string;
    category: string;
}

export function WeeklyCalendar({ items }: { items: ScheduleItem[] }) {
    const currentDay = format(new Date(), "EEE"); // e.g., "Mon"

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="grid grid-cols-7 border-b border-border bg-accent/30 text-center">
                {DAYS.map((day) => (
                    <div
                        key={day}
                        className={cn(
                            "py-3 text-sm font-semibold",
                            currentDay === day ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        )}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid min-h-[400px] grid-cols-7 divide-x divide-border">
                {DAYS.map((day) => {
                    const dayItems = items.filter(item => item.day === day)
                        .sort((a, b) => a.time.localeCompare(b.time));

                    return (
                        <div key={day} className="flex flex-col gap-2 p-2">
                            {dayItems.length === 0 && (
                                <div className="mt-10 text-center text-xs text-muted-foreground/50">No classes</div>
                            )}
                            {dayItems.map(item => (
                                <div
                                    key={item._id}
                                    className={cn(
                                        "flex flex-col rounded-md border p-2 text-xs shadow-sm transition-all hover:shadow-md",
                                        item.category === "Hifz" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30" :
                                            item.category === "Tajweed" ? "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30" :
                                                "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/30"
                                    )}
                                >
                                    <span className="font-bold text-foreground">{item.time}</span>
                                    <span className="line-clamp-2 font-medium">{item.className}</span>
                                    <span className="mt-1 inline-block rounded-sm bg-background/50 px-1 py-0.5 text-[10px] opacity-70">
                                        {item.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
