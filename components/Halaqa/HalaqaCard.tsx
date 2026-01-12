"use client";

import React from "react";
import { Users, Clock } from "lucide-react";
// We define a simple interface for the class object, assuming Id is handled by generic or passed down
interface ClassData {
    _id: string;
    name: string;
    category: string;
    teacherId: string;
    schedule: { day: string; time: string }[];
}

export function HalaqaCard({ data }: { data: ClassData }) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {data.category}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-xs">0 Students</span>
                </div>
            </div>

            <h3 className="mb-2 font-amiri text-lg font-bold text-foreground group-hover:text-primary">
                {data.name}
            </h3>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {data.schedule.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-1 rounded-md bg-accent px-2 py-1">
                        <Clock className="h-3 w-3" />
                        <span>{slot.day} {slot.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
