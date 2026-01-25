"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Clock, BookOpen, Star, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProgressHistory() {
    const history = useQuery(api.tracker.getHistory);

    if (history === undefined) {
        return (
            <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px] text-muted-foreground animate-pulse">
                <BookOpen className="h-10 w-10 mb-4 opacity-50" />
                <p>Loading history...</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
                <div className="h-16 w-16 rounded-full bg-accent/30 flex items-center justify-center mb-4">
                    <Activity className="h-8 w-8 opacity-50" />
                </div>
                <h3 className="text-xl font-bold mb-2">Start Your Journey</h3>
                <p className="max-w-xs text-center opacity-70">No logs yet. Complete your first memorization or review session to see your history here!</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-8 rounded-[32px]">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-amiri text-2xl font-bold text-foreground">Activity Log</h3>
            </div>

            <div className="relative border-l-2 border-border/50 ml-3 space-y-8 pb-2">
                {history.map((log, idx) => (
                    <div key={log._id} className="relative pl-6 group">
                        {/* Timeline Dot */}
                        <div className={cn(
                            "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-background transition-colors",
                            log.type === 'hifz' ? "bg-emerald-500 group-hover:bg-emerald-400" : "bg-sky-500 group-hover:bg-sky-400"
                        )} />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-lg text-foreground">{log.surahName}</h4>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                        log.type === 'hifz' ? "bg-emerald-500/10 text-emerald-500" : "bg-sky-500/10 text-sky-500"
                                    )}>
                                        {log.type}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                                    <BookOpen className="h-3 w-3" />
                                    Ayah {log.ayahStart} - {log.ayahEnd}
                                </p>
                                {log.notes && (
                                    <p className="mt-2 text-sm italic text-muted-foreground/80 border-l-2 border-border pl-3">
                                        "{log.notes}"
                                    </p>
                                )}
                            </div>

                            <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                <div className="flex gap-0.5" title={`${log.rating}/5 Rating`}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "h-3 w-3",
                                                i < log.rating ? "fill-amber-400 text-amber-400" : "text-border"
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                    {formatDistanceToNow(new Date(log.date), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
