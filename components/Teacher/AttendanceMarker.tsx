import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Loader2, Users, CalendarDays, Sparkles, ChevronRight, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";

export function AttendanceMarker() {
    const { t, locale, dir } = useLanguage();
    const classes = useQuery(api.teacher.getMyClasses);
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const classDetails = useQuery(api.teacher.getClassDetails,
        selectedClassId ? { classId: selectedClassId as any } : "skip"
    );
    const students = classDetails?.students || [];
    const logAttendance = useMutation(api.attendance.logAttendance);

    const [attendanceStates, setAttendanceStates] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceStates(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async () => {
        if (!selectedClassId) return;
        setIsSubmitting(true);
        const date = new Date().toISOString().split('T')[0];

        try {
            await Promise.all(
                Object.entries(attendanceStates).map(([studentId, status]) =>
                    logAttendance({
                        studentId: studentId as any,
                        classId: selectedClassId as any,
                        date,
                        status
                    })
                )
            );
            toast.success(locale === 'ar' ? "تم حفظ الحضور بنجاح" : "Attendance synced successfully!", {
                icon: <Sparkles className="h-4 w-4 text-emerald-500" />
            });
            setAttendanceStates({});
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
                {locale === 'ar' ? "جاري البحث عن الحلقات..." : "Scanning Classes..."}
            </p>
        </div>
    );

    return (
        <Card className="overflow-hidden border-none bg-background/50 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
            <CardHeader className="border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent">
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
                            className="appearance-none text-sm font-medium border-white/10 rounded-full px-6 py-2 bg-black/40 text-emerald-100 hover:bg-black/60 transition-all cursor-pointer ring-1 ring-emerald-500/20 focus:ring-emerald-500/50 outline-none pr-10"
                        >
                            <option value="" className="bg-zinc-900">{t.teacher.attendance.selectClass}</option>
                            {classes.map(c => (
                                <option key={c._id} value={c._id} className="bg-zinc-900">{c.name}</option>
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
                                        ? "اختر حلقة قرآنية من القائمة لبدء تسجيل حضور الطلاب ومتابعة مسيرتهم التعليمية."
                                        : "Select a halaqa above to begin tracking the light of knowledge in your students."
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
                                <p className="text-xs text-muted-foreground mt-1">This halaqa seems to be empty for now.</p>
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

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-500/20 hover:scrollbar-thumb-emerald-500/40 transition-colors">
                                {students.map((student: any, idx: number) => (
                                    <motion.div
                                        key={student._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={cn(
                                            "group flex items-center justify-between p-4 rounded-2xl border bg-white/5 transition-all duration-300 relative overflow-hidden",
                                            attendanceStates[student._id]
                                                ? "border-emerald-500/30 bg-emerald-500/5"
                                                : "border-white/5 hover:border-emerald-500/20 hover:bg-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-emerald-100 font-bold group-hover:scale-110 transition-transform">
                                                {student.name.charAt(0)}
                                            </div>
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
                                                        {attendanceStates[student._id] || "No Status Set"}
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
                                                    {/* Custom Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-zinc-800 text-[10px] font-bold text-white opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 ring-1 ring-white/10 shadow-xl">
                                                        {label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Background Decoration */}
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                            {attendanceStates[student._id] === 'present' && <Sparkles className="h-4 w-4 text-emerald-400" />}
                                        </div>
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
                                            <span>Syncing Knowledge...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                                            <span>Confirm Attendance</span>
                                            <Sparkles className="h-4 w-4 ml-1 opacity-10 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-tighter opacity-50">
                                    All logs are saved to the divine cloud securely
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}

const Plus = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
);
