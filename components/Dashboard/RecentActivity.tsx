"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const activities = [
    { id: 1, title: "Surah Al-Mulk: Ayah 1-15", status: "passed", date: "Today, 5:30 PM", rating: 5 },
    { id: 2, title: "Surah Al-Qalam: Ayah 1-10", status: "passed", date: "Yesterday, 6:00 PM", rating: 4 },
    { id: 3, title: "Surah Al-Haaqqa Review", status: "needs_review", date: "12 Jan, 5:00 PM", rating: 2 },
];

export function RecentActivity() {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-amiri text-xl font-bold text-foreground">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3 transition-colors hover:bg-accent/50">
                        <div className="flex items-center gap-3">
                            {activity.status === "passed" ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                                <XCircle className="h-5 w-5 text-amber-500" />
                            )}
                            <div>
                                <p className="font-medium text-foreground">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Star rating mock */}
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`text-sm ${i < activity.rating ? "text-amber-400" : "text-input"}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
