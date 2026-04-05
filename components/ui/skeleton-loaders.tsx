"use client";

import { cn } from "@/lib/utils";

// ── Generic skeleton primitive ────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn("animate-pulse rounded-xl bg-white/5", className)} />
    );
}

// ── Bento card skeleton (matches TeacherMetric / ParentBentoCard shape) ───────
export function BentoCardSkeleton() {
    return (
        <div className="glass-card p-6 rounded-[24px] border border-white/5 bg-slate-900/40 h-full space-y-4">
            {/* Icon + badge row */}
            <div className="flex justify-between items-start">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            {/* Value */}
            <Skeleton className="h-10 w-20 rounded-lg" />
            {/* Label */}
            <Skeleton className="h-3 w-28 rounded-md" />
            {/* Sub-label */}
            <div className="pt-2 border-t border-white/5">
                <Skeleton className="h-2.5 w-36 rounded-md" />
            </div>
        </div>
    );
}

// ── Hero section skeleton ─────────────────────────────────────────────────────
export function HeroSkeleton() {
    return (
        <div className="relative rounded-[32px] overflow-hidden p-8 min-h-[240px] flex flex-col justify-center border border-white/5 bg-slate-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 animate-pulse" />
            <div className="relative z-10 space-y-4">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-12 w-72 rounded-2xl" />
                <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
        </div>
    );
}

// ── Timeline entry skeleton ───────────────────────────────────────────────────
export function TimelineEntrySkeleton() {
    return (
        <div className="relative pl-6">
            <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36 rounded-lg" />
                        <Skeleton className="h-3 w-24 rounded-md" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-2.5 w-16 rounded-md ml-auto" />
                </div>
            </div>
        </div>
    );
}

// ── Attendance list skeleton ──────────────────────────────────────────────────
export function AttendanceRowSkeleton() {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/3">
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-full" />
        </div>
    );
}

// ── Student list row skeleton (used in AttendanceMarker / BulkLogbook) ────────
export function StudentRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/3 border border-white/5">
            <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded-lg" />
                <Skeleton className="h-2.5 w-20 rounded-md" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
        </div>
    );
}

// ── Convenience wrapper: 4-column bento grid ──────────────────────────────────
export function BentoGridSkeleton({ cols = 4 }: { cols?: number }) {
    return (
        <div className={cn("grid gap-4 grid-cols-1 md:grid-cols-2", cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
            {Array.from({ length: cols }).map((_, i) => (
                <BentoCardSkeleton key={i} />
            ))}
        </div>
    );
}
