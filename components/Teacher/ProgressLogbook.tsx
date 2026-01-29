import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Star, Sparkles, User, GraduationCap, ArrowRight, PenLine, ScrollText, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useLanguage } from "@/lib/language-context";

export function ProgressLogbook() {
    const { t, locale, dir } = useLanguage();
    const classes = useQuery(api.teacher.getMyClasses);
    const [selectedClassId, setSelectedClassId] = useState("");
    const classDetails = useQuery(api.teacher.getClassDetails, selectedClassId ? { classId: selectedClassId as any } : "skip");
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const logProgress = useMutation(api.teacher.logProgress);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const students = classDetails?.students || [];

    const [form, setForm] = useState({
        surahName: "",
        ayahStart: "1",
        ayahEnd: "10",
        topic: "",
        score: "",
        rating: "5",
        status: "Passed",
        notes: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId || !selectedClassId) return;
        setIsSubmitting(true);

        try {
            await logProgress({
                studentId: selectedStudentId as any,
                classId: selectedClassId as any,
                surahName: form.surahName || undefined,
                ayahStart: form.ayahStart ? parseInt(form.ayahStart) : undefined,
                ayahEnd: form.ayahEnd ? parseInt(form.ayahEnd) : undefined,
                topic: form.topic || undefined,
                score: form.score ? parseInt(form.score) : undefined,
                rating: parseInt(form.rating),
                status: form.status,
                notes: form.notes
            });
            toast.success(locale === 'ar' ? "تم حفظ التقدم بنجاح" : "Progress Logged!", {
                icon: <Sparkles className="h-4 w-4 text-emerald-500" />
            });
            setForm({ text: "", surahName: "", ayahStart: "1", ayahEnd: "10", topic: "", score: "", rating: "5", status: "Passed", notes: "" } as any);
        } catch (error) {
            console.error(error);
            toast.error(locale === 'ar' ? "فشل حفظ التقدم" : "Failed to log progress");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="border-none bg-background/50 backdrop-blur-xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-gradient-to-r from-amber-500/10 to-transparent">
                <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                        <ScrollText className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xl font-bold font-amiri tracking-tight">{t.teacher.logbook.title}</span>
                        <p className="text-xs text-muted-foreground font-normal">
                            {locale === 'ar' ? "تسجيل الحفظ والتقدم الأكاديمي للطلاب" : "Record recitation & academic milestones"}
                        </p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 mb-8">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{t.teacher.attendance.selectClass}</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full rounded-2xl border-white/10 p-3 text-sm bg-black/40 text-white focus:ring-amber-500/50 outline-none ring-1 ring-white/5"
                        >
                            <option value="">{t.teacher.attendance.selectClass}</option>
                            {classes?.map(c => <option key={c._id} value={c._id} className="bg-zinc-900">{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{t.teacher.logbook.student}</label>
                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="w-full rounded-2xl border-white/10 p-3 text-sm bg-black/40 text-white focus:ring-amber-500/50 outline-none ring-1 ring-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={!selectedClassId}
                        >
                            <option value="">{t.teacher.logbook.student}</option>
                            {students?.map((s: any) => <option key={s._id} value={s._id} className="bg-zinc-900">{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!selectedStudentId ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center py-16 text-center space-y-6"
                        >
                            <div className="relative">
                                <BookOpen className="h-24 w-24 text-amber-500/5" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PenLine className="h-10 w-10 text-amber-500/40 animate-bounce" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-amber-50 font-amiri italic tracking-widest uppercase">Select a Reciter</h3>
                                <p className="text-muted-foreground text-sm max-w-[300px] mx-auto leading-relaxed">
                                    Pick a student from the list above to record their daily progress and achievements.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <GraduationCap className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-amber-500/60 uppercase tracking-tighter">Logging for</p>
                                    <p className="font-bold text-amber-100">{students.find((s: any) => s._id === selectedStudentId)?.name || 'Student'}</p>
                                </div>
                            </div>

                            {/* Dynamic Form Fields */}
                            <AnimatePresence mode="wait">
                                {classDetails?.subject === "Quran" || !classDetails?.subject ? (
                                    <motion.div
                                        key="quran-fields"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Surah / Juz</label>
                                                <input
                                                    value={form.surahName}
                                                    onChange={(e) => setForm({ ...form, surahName: e.target.value })}
                                                    className="w-full rounded-xl border-white/10 p-3 text-sm bg-background focus:ring-amber-500/50 outline-none ring-1 ring-white/5"
                                                    placeholder="e.g. Al-Baqarah"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Overall Impression</label>
                                                <div className="flex items-center justify-between h-11 px-4 rounded-xl border border-white/10 bg-background ring-1 ring-white/5">
                                                    {[1, 2, 3, 4, 5].map(num => (
                                                        <motion.button
                                                            key={num}
                                                            type="button"
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setForm({ ...form, rating: num.toString() })}
                                                            className={cn(
                                                                "transition-all duration-300",
                                                                parseInt(form.rating) >= num ? 'text-amber-500' : 'text-white/10'
                                                            )}
                                                        >
                                                            <Star className={cn("h-5 w-5", parseInt(form.rating) >= num ? 'fill-current' : '')} />
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Ayah Range</label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="number"
                                                        value={form.ayahStart}
                                                        onChange={(e) => setForm({ ...form, ayahStart: e.target.value })}
                                                        className="w-full rounded-xl border-white/10 p-3 text-sm bg-background text-center focus:ring-amber-500/50 outline-none ring-1 ring-white/5"
                                                    />
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                    <input
                                                        type="number"
                                                        value={form.ayahEnd}
                                                        onChange={(e) => setForm({ ...form, ayahEnd: e.target.value })}
                                                        className="w-full rounded-xl border-white/10 p-3 text-sm bg-background text-center focus:ring-amber-500/50 outline-none ring-1 ring-white/5"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Proficiency</label>
                                                <select
                                                    value={form.status}
                                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                                    className="w-full rounded-xl border-white/10 p-3 text-sm bg-background focus:ring-amber-500/50 outline-none ring-1 ring-white/5"
                                                >
                                                    <option value="Passed" className="bg-zinc-900">Outstanding / Passed</option>
                                                    <option value="Needs Review" className="bg-zinc-900">Needs Practice</option>
                                                    <option value="Failed" className="bg-zinc-900">Re-check Required</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="academic-fields"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Lesson Topic / Chapter</label>
                                            <input
                                                value={form.topic}
                                                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                                className="w-full rounded-xl border-white/10 p-3 text-sm bg-background focus:ring-amber-500/50 outline-none ring-1 ring-white/5"
                                                placeholder={`e.g. ${classDetails.subject} Lesson 5`}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Grade / Score (%)</label>
                                                <input
                                                    type="number"
                                                    value={form.score}
                                                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                                                    className="w-full rounded-xl border-white/10 p-3 text-sm bg-background focus:ring-amber-500/50 outline-none ring-1 ring-white/5"
                                                    placeholder="0-100"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Overall Rating</label>
                                                <div className="flex items-center justify-between h-11 px-4 rounded-xl border border-white/10 bg-background ring-1 ring-white/5">
                                                    {[1, 2, 3, 4, 5].map(num => (
                                                        <button
                                                            key={num}
                                                            type="button"
                                                            onClick={() => setForm({ ...form, rating: num.toString() })}
                                                            className={cn(
                                                                "transition-all duration-300 hover:scale-110",
                                                                parseInt(form.rating) >= num ? 'text-amber-500' : 'text-white/10'
                                                            )}
                                                        >
                                                            <Star className={cn("h-5 w-5", parseInt(form.rating) >= num ? 'fill-current' : '')} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Guiding Notes</label>
                                <textarea
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    className="w-full rounded-2xl border-white/10 p-4 text-sm bg-black/20 focus:ring-amber-500/50 outline-none ring-1 ring-white/5 resize-none h-28"
                                    placeholder="Add constructive feedback or specific focus areas for next time..."
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-lg shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden group"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Saving into Eternity...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <ScrollText className="h-5 w-5 group-hover:-rotate-12 transition-transform" />
                                        <span>Submit Logbook Entry</span>
                                        <Sparkles className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </Button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
