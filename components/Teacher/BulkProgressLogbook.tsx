"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
    Loader2, Star, CheckCircle, XCircle, Clock,
    ChevronRight, ScrollText, Sparkles, Users, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";

type Status = "Passed" | "Needs Review" | "Failed";

interface RowState {
    surahName: string;
    topic: string;
    ayahStart: string;
    ayahEnd: string;
    score: string;
    rating: number;
    status: Status;
    notes: string;
}

const defaultRow = (): RowState => ({
    surahName: "", topic: "", ayahStart: "", ayahEnd: "",
    score: "", rating: 5, status: "Passed", notes: ""
});

export function BulkProgressLogbook() {
    const { locale } = useLanguage();
    const classes = useQuery(api.teacher.getMyClasses);
    const [selectedClassId, setSelectedClassId] = useState("");
    const classDetails = useQuery(
        api.teacher.getClassDetails,
        selectedClassId ? { classId: selectedClassId as Id<"classes"> } : "skip"
    );
    const logProgress = useMutation(api.teacher.logProgress);

    const students = (classDetails?.students ?? []) as Array<{ _id: Id<"users">; name: string }>;

    const [rows, setRows] = useState<Record<string, RowState>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subject, setSubject] = useState<"quran" | "general">("quran");
    const [submitted, setSubmitted] = useState<string[]>([]);

    // When class changes, reset rows
    const handleClassChange = (classId: string) => {
        setSelectedClassId(classId);
        setRows({});
        setSubmitted([]);
        // Detect subject type from class
        const found = classes?.find(c => c._id === classId);
        const sub = (found as any)?.subject?.toLowerCase() ?? "";
        setSubject(sub && sub !== "quran" ? "general" : "quran");
    };

    const updateRow = (studentId: string, patch: Partial<RowState>) => {
        setRows(prev => ({
            ...prev,
            [studentId]: { ...(prev[studentId] ?? defaultRow()), ...patch }
        }));
    };

    const filledCount = Object.keys(rows).filter(id => {
        const r = rows[id];
        return r && (r.surahName || r.topic || r.score);
    }).length;

    const handleSubmitAll = async () => {
        if (!selectedClassId) return;
        const entries = Object.entries(rows).filter(([, r]) => r.surahName || r.topic || r.score);
        if (entries.length === 0) {
            toast.warning("Fill in at least one student's progress before submitting.");
            return;
        }
        setIsSubmitting(true);
        const successIds: string[] = [];
        try {
            await Promise.all(
                entries.map(async ([studentId, r]) => {
                    await logProgress({
                        studentId: studentId as Id<"users">,
                        classId: selectedClassId as Id<"classes">,
                        surahName: r.surahName || undefined,
                        ayahStart: r.ayahStart ? parseInt(r.ayahStart) : undefined,
                        ayahEnd: r.ayahEnd ? parseInt(r.ayahEnd) : undefined,
                        topic: r.topic || undefined,
                        score: r.score ? parseInt(r.score) : undefined,
                        rating: r.rating,
                        status: r.status,
                        notes: r.notes || undefined,
                    });
                    successIds.push(studentId);
                })
            );
            setSubmitted(prev => [...prev, ...successIds]);
            toast.success(`✅ ${entries.length} student${entries.length > 1 ? "s" : ""} logged successfully!`, {
                icon: <Sparkles className="h-4 w-4 text-emerald-500" />
            });
            setRows({});
        } catch (err) {
            console.error(err);
            toast.error("Some entries failed to save. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <ScrollText className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{locale === 'ar' ? 'تسجيل جماعي' : 'Bulk Progress Log'}</h3>
                        <p className="text-xs text-white/40">Log progress for all students at once</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Subject type toggle */}
                    <div className="flex rounded-xl overflow-hidden border border-white/10 bg-black/30">
                        {(['quran', 'general'] as const).map(s => (
                            <button key={s} onClick={() => setSubject(s)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-bold transition-all capitalize",
                                    subject === s ? "bg-amber-500 text-white" : "text-white/40 hover:text-white/70"
                                )}>
                                {s === 'quran' ? 'Quran / Recitation' : 'Subject / Academic'}
                            </button>
                        ))}
                    </div>
                    {/* Class selector */}
                    <div className="relative">
                        <select
                            value={selectedClassId}
                            onChange={(e) => handleClassChange(e.target.value)}
                            className="appearance-none text-sm font-medium rounded-xl px-4 py-2 pr-8 bg-black/40 text-amber-100 ring-1 ring-amber-500/20 focus:ring-amber-500/50 outline-none cursor-pointer"
                        >
                            <option value="">Select Class</option>
                            {classes?.map(c => (
                                <option key={c._id} value={c._id} className="bg-zinc-900">{c.name}</option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!selectedClassId ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-16 text-center space-y-4 rounded-2xl border border-dashed border-white/10">
                        <Users className="h-12 w-12 text-white/10" />
                        <p className="text-white/30 text-sm">Select a class to load the student roster</p>
                    </motion.div>
                ) : classDetails === undefined ? (
                    <motion.div key="loading" className="flex items-center justify-center py-16">
                        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                    </motion.div>
                ) : students.length === 0 ? (
                    <motion.div key="no-students" className="flex flex-col items-center justify-center py-16 space-y-3">
                        <Users className="h-10 w-10 text-white/10" />
                        <p className="text-white/30 text-sm">No students enrolled in this class yet.</p>
                    </motion.div>
                ) : (
                    <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        {/* Column Headers */}
                        <div className={cn(
                            "hidden sm:grid gap-3 px-4 py-2 rounded-xl bg-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest",
                            subject === 'quran'
                                ? "grid-cols-[2fr_1fr_1fr_1fr_0.7fr_1fr]"
                                : "grid-cols-[2fr_2fr_1fr_0.7fr_1fr]"
                        )}>
                            <span>Student</span>
                            {subject === 'quran' ? (
                                <><span>Surah / Juz</span><span>From</span><span>To</span></>
                            ) : (
                                <><span>Topic / Chapter</span><span>Score %</span></>
                            )}
                            <span>Rating</span>
                            <span>Status</span>
                        </div>

                        {/* Student Rows */}
                        {students.map((student, idx) => {
                            const row = rows[student._id] ?? defaultRow();
                            const isDone = submitted.includes(student._id);

                            return (
                                <motion.div
                                    key={student._id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className={cn(
                                        "relative p-4 rounded-2xl border transition-all",
                                        isDone
                                            ? "bg-emerald-500/5 border-emerald-500/20 opacity-60"
                                            : rows[student._id]
                                                ? "bg-amber-500/5 border-amber-500/20"
                                                : "bg-white/3 border-white/5 hover:border-white/10"
                                    )}
                                >
                                    {isDone && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                                                <CheckCircle className="h-3 w-3" /> Logged
                                            </span>
                                        </div>
                                    )}

                                    <div className={cn("flex flex-col sm:flex-row gap-3 items-start sm:items-center", isDone && "opacity-30")}>
                                        {/* Student Name */}
                                        <div className="flex items-center gap-3 sm:w-[200px] flex-shrink-0">
                                            <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 font-bold text-sm flex-shrink-0">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white leading-tight">{student.name}</p>
                                                <p className="text-[10px] text-white/30">Student</p>
                                            </div>
                                        </div>

                                        {/* Input Fields */}
                                        <div className="flex flex-wrap gap-2 flex-1">
                                            {subject === 'quran' ? (
                                                <>
                                                    <input
                                                        placeholder="Surah / Juz"
                                                        value={row.surahName}
                                                        onChange={e => updateRow(student._id, { surahName: e.target.value })}
                                                        disabled={isDone}
                                                        className="flex-1 min-w-[100px] rounded-xl px-3 py-2 text-sm bg-black/30 ring-1 ring-white/10 focus:ring-amber-500/50 outline-none text-white placeholder:text-white/20"
                                                    />
                                                    <input
                                                        type="number" placeholder="From"
                                                        value={row.ayahStart}
                                                        onChange={e => updateRow(student._id, { ayahStart: e.target.value })}
                                                        disabled={isDone}
                                                        className="w-16 rounded-xl px-3 py-2 text-sm bg-black/30 ring-1 ring-white/10 focus:ring-amber-500/50 outline-none text-white text-center placeholder:text-white/20"
                                                    />
                                                    <input
                                                        type="number" placeholder="To"
                                                        value={row.ayahEnd}
                                                        onChange={e => updateRow(student._id, { ayahEnd: e.target.value })}
                                                        disabled={isDone}
                                                        className="w-16 rounded-xl px-3 py-2 text-sm bg-black/30 ring-1 ring-white/10 focus:ring-amber-500/50 outline-none text-white text-center placeholder:text-white/20"
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <input
                                                        placeholder="Topic / Chapter"
                                                        value={row.topic}
                                                        onChange={e => updateRow(student._id, { topic: e.target.value })}
                                                        disabled={isDone}
                                                        className="flex-1 min-w-[120px] rounded-xl px-3 py-2 text-sm bg-black/30 ring-1 ring-white/10 focus:ring-amber-500/50 outline-none text-white placeholder:text-white/20"
                                                    />
                                                    <input
                                                        type="number" placeholder="Score %"
                                                        value={row.score}
                                                        onChange={e => updateRow(student._id, { score: e.target.value })}
                                                        disabled={isDone}
                                                        className="w-20 rounded-xl px-3 py-2 text-sm bg-black/30 ring-1 ring-white/10 focus:ring-amber-500/50 outline-none text-white text-center placeholder:text-white/20"
                                                    />
                                                </>
                                            )}

                                            {/* Star Rating */}
                                            <div className="flex items-center gap-0.5 px-2 rounded-xl bg-black/20 ring-1 ring-white/5">
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <button key={n} type="button"
                                                        onClick={() => !isDone && updateRow(student._id, { rating: n })}
                                                        disabled={isDone}
                                                        className={cn("transition-all hover:scale-110", n <= row.rating ? "text-amber-500" : "text-white/10")}
                                                    >
                                                        <Star className={cn("h-4 w-4", n <= row.rating ? "fill-current" : "")} />
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Status */}
                                            <div className="flex rounded-xl overflow-hidden ring-1 ring-white/10 bg-black/20">
                                                {([
                                                    { v: "Passed" as Status, icon: CheckCircle, color: "hover:bg-emerald-500/20 hover:text-emerald-400", active: "bg-emerald-500/20 text-emerald-400" },
                                                    { v: "Needs Review" as Status, icon: Clock, color: "hover:bg-amber-500/20 hover:text-amber-400", active: "bg-amber-500/20 text-amber-400" },
                                                    { v: "Failed" as Status, icon: XCircle, color: "hover:bg-red-500/20 hover:text-red-400", active: "bg-red-500/20 text-red-400" },
                                                ] as const).map(({ v: sv, icon: Icon, color, active }) => (
                                                    <button key={sv} type="button"
                                                        onClick={() => !isDone && updateRow(student._id, { status: sv })}
                                                        disabled={isDone}
                                                        title={sv}
                                                        className={cn(
                                                            "h-9 w-9 flex items-center justify-center transition-all text-white/20",
                                                            row.status === sv ? active : color
                                                        )}>
                                                        <Icon className="h-4 w-4" />
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Notes (collapsible) */}
                                            <input
                                                placeholder="Notes (optional)"
                                                value={row.notes}
                                                onChange={e => updateRow(student._id, { notes: e.target.value })}
                                                disabled={isDone}
                                                className="flex-1 min-w-[140px] rounded-xl px-3 py-2 text-xs bg-black/20 ring-1 ring-white/5 focus:ring-amber-500/30 outline-none text-white/60 placeholder:text-white/15"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Submit Bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="sticky bottom-4 pt-4 z-10"
                        >
                            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-amber-500/20 shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <BookOpen className="h-4 w-4 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white">{filledCount} of {students.length} students</p>
                                        <p className="text-[10px] text-white/30">entries ready to submit</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleSubmitAll}
                                    disabled={filledCount === 0 || isSubmitting}
                                    className="h-11 px-8 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving...</span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            Submit All ({filledCount})
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
