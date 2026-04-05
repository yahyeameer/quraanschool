"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, TrendingUp, CheckCircle, XCircle, Clock, BarChart2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentQuickLookProps {
    studentId: Id<"users"> | null;
    studentName: string;
    onClose: () => void;
}

export function StudentQuickLook({ studentId, studentName, onClose }: StudentQuickLookProps) {
    const history = useQuery(
        api.teacher.getStudentProgressHistory,
        studentId ? { studentId } : "skip"
    );

    const recentRecords = history?.slice(0, 10) ?? [];
    const avgRating = recentRecords.length > 0
        ? (recentRecords.reduce((s, r) => s + (r.rating ?? 0), 0) / recentRecords.length).toFixed(1)
        : "N/A";
    const passRate = recentRecords.length > 0
        ? Math.round((recentRecords.filter(r => r.status === "Passed").length / recentRecords.length) * 100)
        : 0;

    // Bar chart: max bar = last 7 records by rating
    const chartData = recentRecords.slice(0, 7).reverse();

    return (
        <AnimatePresence>
            {studentId && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
                    >
                        <div className="flex flex-col h-full bg-slate-900 border-l border-white/10 overflow-y-auto">
                            {/* Header */}
                            <div className="relative p-6 pb-4 border-b border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 flex-shrink-0">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-xs font-bold text-emerald-400/70 uppercase tracking-widest mb-1">Student Profile</p>
                                        <h2 className="text-2xl font-bold text-white font-amiri">{studentName}</h2>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-3 mt-5 relative z-10">
                                    {[
                                        { label: "Avg Rating", value: avgRating, icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
                                        { label: "Pass Rate", value: `${passRate}%`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                                        { label: "Sessions", value: recentRecords.length.toString(), icon: BookOpen, color: "text-violet-400", bg: "bg-violet-500/10" },
                                    ].map(({ label, value, icon: Icon, color, bg }) => (
                                        <div key={label} className={cn("rounded-2xl p-3 border border-white/5", bg)}>
                                            <Icon className={cn("h-4 w-4 mb-2", color)} />
                                            <div className={cn("text-xl font-bold", color)}>{value}</div>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wide mt-0.5">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Bar Chart */}
                            {chartData.length > 0 && (
                                <div className="p-6 border-b border-white/5">
                                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <BarChart2 className="h-3 w-3" /> Rating Trend (Last {chartData.length} Sessions)
                                    </h3>
                                    <div className="flex items-end gap-2 h-20">
                                        {chartData.map((r, i) => {
                                            const h = ((r.rating ?? 0) / 5) * 100;
                                            const isPass = r.status === "Passed";
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                                    <div className="relative w-full">
                                                        <div className="absolute bottom-0 left-0 right-0 rounded-t-md transition-all duration-500"
                                                            style={{
                                                                height: `${Math.max(h, 8)}%`,
                                                                maxHeight: "64px",
                                                                backgroundColor: isPass ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.4)"
                                                            }}
                                                        />
                                                    </div>
                                                    <div className={cn("h-16 w-full rounded-t-md", isPass ? "bg-emerald-500/20" : "bg-red-500/20")}
                                                        style={{ backgroundSize: "100% 100%", backgroundImage: "none", position: "relative" }}>
                                                        <div
                                                            className={cn("absolute bottom-0 left-0 right-0 rounded-t-md", isPass ? "bg-emerald-500" : "bg-red-400")}
                                                            style={{ height: `${Math.max(h, 8)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] text-white/30">{r.rating}★</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Progress Log */}
                            <div className="p-6 flex-1">
                                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Recent Progress Log</h3>
                                {!history ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
                                        ))}
                                    </div>
                                ) : recentRecords.length === 0 ? (
                                    <div className="text-center py-12 text-white/30 text-sm">No progress records yet.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {recentRecords.map((r, i) => (
                                            <motion.div
                                                key={r._id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.04 }}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {r.status === "Passed" ? (
                                                            <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                                        ) : r.status === "Needs Review" ? (
                                                            <Clock className="h-4 w-4 text-amber-400 flex-shrink-0" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                                                        )}
                                                        <span className="font-bold text-white text-sm">
                                                            {r.surahName || r.topic || "Session"}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Star key={s} className={cn("h-3 w-3", s <= (r.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-white/10")} />
                                                        ))}
                                                    </div>
                                                </div>
                                                {r.notes && (
                                                    <p className="text-xs text-white/40 italic pl-6 line-clamp-2">{r.notes}</p>
                                                )}
                                                <div className="flex items-center gap-2 mt-2 pl-6">
                                                    <span className={cn(
                                                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                                                        r.status === "Passed" ? "bg-emerald-500/10 text-emerald-400" :
                                                            r.status === "Needs Review" ? "bg-amber-500/10 text-amber-400" :
                                                                "bg-red-500/10 text-red-400"
                                                    )}>
                                                        {r.status}
                                                    </span>
                                                    <span className="text-[10px] text-white/20 ml-auto">{r.date}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
