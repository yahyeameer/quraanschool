"use client";

import React from "react";
import { Calendar, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Basic interface
interface Assignment {
    _id: string;
    title: string;
    description?: string;
    dueDate: string;
    status: string;
}

export function AssignmentCard({ data }: { data: Assignment }) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2 text-emerald-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Assignment</span>
                </div>
            </div>

            <h3 className="mb-2 font-bold text-foreground group-hover:text-primary">
                {data.title}
            </h3>

            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {data.description || "No additional details provided."}
            </p>

            <div className="mt-auto flex items-center gap-2 rounded-md bg-accent/50 px-3 py-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Due {formatDistanceToNow(new Date(data.dueDate), { addSuffix: true })}</span>
            </div>
        </div>
    );
}
