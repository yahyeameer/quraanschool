"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Loader2, Users, CalendarDays, Sparkles, ChevronRight, Fingerprint, BellRing, UserCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";
import { StudentQuickLook } from "./StudentQuickLook";

export function AttendanceMarker() {
    const { t, locale, dir } = useLanguage();
    const classes = useQuery(api.teacher.getMyClasses);
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const classDetails = useQuery(api.teacher.getClassDetails,
        selectedClassId ? { classId: selectedClassId as Id<"classes"> } : "skip"
    );
    const students = classDetails?.students || [];
    const logAttendance = useMutation(api.attendance.logAttendance);
    const sendMessage = useMutation(api.messages.send);

    const [attendanceStates, setAttendanceStates] = useState<Record<string, string>>({});
    const [notifyParent, setNotifyParent] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quickLookStudent, setQuickLookStudent] = useState<{ id: Id<"users">; name: string } | null>(null);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceStates(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async () => {
        if (!selectedClassId) return;
        setIsSubmitting(true);
        const date = new Date().toISOString().split('T')[0];

        try {
            await Promise.all(
                Object.entries(attendanceStates).map(async ([studentId, status]) => {
                    await logAttendance({
                        studentId: studentId as Id<"users">,
                        classId: selectedClassId as Id<"classes">,
                        date,
                        status
                    });

                    // Auto-notify parent if toggled AND status is concerning
                    if (notifyParent[studentId]) {
                        const student = students.find((s: any) => s._id === studentId);
                        const parentId = (student as any)?.parentId;
                        if (parentId) {
                            const className = classDetails?.name ?? "class";
                            const msg = status === "absent"
                                ? `Your child was marked absent from ${className} today (${date}). Please contact the school if needed.`
                                : status === "late"
                                    ? `Your child arrived late to ${className} today (${date}).`
                                    : `Your child attended ${className} today (${date}).`;
                            await sendMessage({
                                recipientId: parentId,
                                subject: `Attendance Update – ${className}`,
                                message: msg,
                                type: "attendance"
                            }).catch(() => { /* Parent may not have account, fail silently */ });
                        }
                    }
                })
            );
            toast.success(locale === 'ar' ? "تم حفظ الحضور بنجاح" : "Attendance synced successfully!", {
                icon: <Sparkles className="h-4 w-4 text-emerald-500" />
            });
            setAttendanceStates({});
            setNotifyParent({});
        } catch (error) {
            console.error("Failed to submit attendance:", error);
            toast.error(locale === 'ar' ? "فشل حفظ الحضور" : "Failed to sync attendance");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (classes === undefined) return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 rounded-3xl border border-dashed border-emerald-500/20 bg-emerald-500/5">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-emerald-500/60 font-medium animate-pulse">
                {locale === 'ar' ? "جاري البحث عن الفصول..." : "Scanning Classes..."}
            </p>
        </div>
    );

    return (
        <>
            <Card className="overflow-hidden border-none bg-background/50 backdrop-blur-xl shadow-2xl ring-1 ring-border">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-emerald-500/10 to-transparent">
                    <CardTitle className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                                <Fingerprint className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="text-xl font-bold font-amiri tracking-tight">{t.teacher.attendance.title}</span>
                                <p className="text-xs text-muted-foreground font-normal">{t.teacher.attendance.markAttendance}</p>
                            </div>
                        </div>

                        <div className="relative group">
                            <select
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                className="appearance-none text-sm font-medium border border-border rounded-full px-6 py-2 bg-accent/20 text-foreground hover:bg-accent/40 transition-all cursor-pointer ring-1 ring-emerald-500/20 focus:ring-emerald-500/50 outline-none pr-10"
                            >
                                <option value="" className="bg-background">{t.teacher.attendance.selectClass}</option>
                                {classes.map(c => (
                                    <option key={c._id} value={c._id} className="bg-background">{c.name}</option>
                                ))}
                            </select>
                            <ChevronRight className={cn(
                                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 transition-transform group-hover:translate-x-1",
                                dir === 'rtl' ? "left-4 rotate-180 group-hover:-translate-x-1" : "right-4"
                            )} />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <AnimatePresence mode="wait">
                        {!selectedClassId ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center py-16 text-center space-y-6"
                            >
                                <div className="relative">
                                    <Users className="h-20 w-20 text-emerald-500/10" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-emerald-50 font-amiri italic uppercase tracking-widest">{t.teacher.attendance.selectClass}</h3>
                                    <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
                                        {locale === 'ar'
                                            ? "اختر فصلًا من القائمة لبدء تسجيل حضور الطلاب."
                                            : "Select a class above to begin marking student attendance."
                                        }
                                    </p>
                                </div>
                            </motion.div>
                        ) : classDetails === undefined ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-3">
                                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                                <p className="text-sm text-emerald-500/40">Preparing student roster...</p>
                            </div>
                        ) : students.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-12 space-y-4"
                            >
                                <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                    <Users className="h-8 w-8 text-amber-500" />
                                </div>
                                <div className="text-center">
                                    <p className="text-amber-200 font-medium">No Students Found</p>
                                    <p className="text-xs text-muted-foreground mt-1">This class has no enrolled students yet.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-3"
                            >
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-500/60 uppercase tracking-widest">
                                        <CalendarDays className="h-3 w-3" />
                                        <span>Today: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{students.length} Students</span>
                                </div>

                                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-500/20 hover:scrollbar-thumb-emerald-500/40 transition-colors">
                                    {students.map((student: any, idx: number) => (
                                        <motion.div
                                            key={student._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={cn(
                                                "group flex flex-col gap-2 p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                                                attendanceStates[student._id]
                                                    ? "border-emerald-500/30 bg-emerald-500/5"
                                                    : "border-border bg-accent/10 hover:border-emerald-500/20 hover:bg-accent/20"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 relative z-10">
                                                    {/* Avatar — clickable for Quick Look */}
                                                    <button
                                                        onClick={() => setQuickLookStudent({ id: student._id, name: student.name })}
                                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent/20 border border-border text-foreground font-bold group-hover:scale-110 transition-transform hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-300"
                                                        title="View student profile"
                                                    >
                                                        {student.name.charAt(0)}
                                                    </button>
                                                    <div>
                                                        <p className="font-bold text-emerald-50 group-hover:text-emerald-400 transition-colors">{student.name}</p>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <div className={cn(
                                                                "h-1.5 w-1.5 rounded-full animate-pulse",
                                                                attendanceStates[student._id] === 'present' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                                                                    attendanceStates[student._id] === 'absent' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                                                                        attendanceStates[student._id] === 'late' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                                                                            "bg-white/20"
                                                            )} />
                                                            <span className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground">
                                                                {attendanceStates[student._id] || "No Status"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-1.5 relative z-10">
                                                    {[
                                                        { status: 'present', icon: Check, color: 'emerald', label: 'Present' },
                                                        { status: 'late', icon: Clock, color: 'amber', label: 'Late' },
                                                        { status: 'absent', icon: X, color: 'red', label: 'Absent' }
                                                    ].map(({ status, icon: Icon, color, label }) => (
                                                        <div key={status} className="relative group/btn">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleStatusChange(student._id, status)}
                                                                className={cn(
                                                                    "h-10 w-10 rounded-xl transition-all border duration-200",
                                                                    attendanceStates[student._id] === status
                                                                        ? `bg-${color}-500/20 border-${color}-500/50 text-${color}-400`
                                                                        : `border-transparent hover:bg-${color}-500/10 hover:text-${color}-400 text-muted-foreground/60`
                                                                )}
                                                            >
                                                                <Icon className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    ))}

                                                    {/* Quick Look button */}
                                                    <button
                                                        onClick={() => setQuickLookStudent({ id: student._id, name: student.name })}
                                                        className="h-10 w-10 rounded-xl border border-transparent hover:border-violet-500/30 hover:bg-violet-500/10 text-muted-foreground/40 hover:text-violet-400 transition-all flex items-center justify-center"
                                                        title="Quick look"
                                                    >
                                                        <UserCircle2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Notify Parent toggle — shows up after status is set */}
                                            <AnimatePresence>
                                                {attendanceStates[student._id] && (student as any)?.parentId && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <button
                                                            onClick={() => setNotifyParent(prev => ({ ...prev, [student._id]: !prev[student._id] }))}
                                                            className={cn(
                                                                "flex items-center gap-2 text-xs font-bold py-1.5 px-3 rounded-full border transition-all",
                                                                notifyParent[student._id]
                                                                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                                                    : "bg-accent/20 border-border text-muted-foreground/40 hover:text-muted-foreground/60"
                                                            )}
                                                        >
                                                            <BellRing className="h-3 w-3" />
                                                            {notifyParent[student._id] ? "Parent will be notified" : "Notify parent?"}
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-2"
                                >
                                    <Button
                                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.98] group relative overflow-hidden disabled:opacity-50 disabled:grayscale"
                                        onClick={handleSubmit}
                                        disabled={Object.keys(attendanceStates).length === 0 || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Syncing...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <Check className="h-5 w-5" />
                                                <span>Confirm Attendance ({Object.keys(attendanceStates).length}/{students.length})</span>
                                                <Sparkles className="h-4 w-4 ml-1 opacity-10 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    </Button>
                                    <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-tighter opacity-50">
                                        All attendance records are securely saved
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Student Quick-Look Slide-over */}
            <StudentQuickLook
                studentId={quickLookStudent?.id ?? null}
                studentName={quickLookStudent?.name ?? ""}
                onClose={() => setQuickLookStudent(null)}
            />
        </>
    );
}
