"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Clock } from "lucide-react";

export function ProgressHistory() {
    const history = useQuery(api.tracker.getHistory);

    if (history === undefined) {
        return <div className="p-4 text-center text-sm text-muted-foreground">Loading history...</div>;
    }

    if (history.length === 0) {
        return <div className="p-4 text-center text-sm text-muted-foreground">No logs yet. Start today!</div>;
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-amiri text-xl font-bold text-foreground">Memorization Log</h3>
            <div className="space-y-4">
                {history.map(log => (
                    <div key={log._id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 h-2 w-2 rounded-full ${log.type === 'hifz' ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                            <div>
                                <p className="font-bold text-foreground">{log.surahName}</p>
                                <p className="text-xs text-muted-foreground">Ayah {log.ayahStart} - {log.ayahEnd}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex justify-end gap-0.5">
                                {Array.from({ length: log.rating }).map((_, i) => (
                                    <span key={i} className="text-xs text-amber-400">★</span>
                                ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                {formatDistanceToNow(new Date(log.date), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
