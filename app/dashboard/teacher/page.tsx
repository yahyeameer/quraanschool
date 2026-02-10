"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AttendanceMarker } from "@/components/Teacher/AttendanceMarker";
import { ProgressLogbook } from "@/components/Teacher/ProgressLogbook";
import { AssignmentManager } from "@/components/Teacher/AssignmentManager";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { TiltCard } from "@/components/ui/tilt-card";
import { useState } from "react";
import {
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    TrendingUp,
    Sparkles,
    ChevronRight,
    GraduationCap,
    Loader2,
    Video,
    MessageSquare,
    Search,
    Eye,
    EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

export default function TeacherDashboard() {
    const { t, locale, dir } = useLanguage();
    const classes = useQuery(api.teacher.getMyClasses);
    const user = useQuery(api.users.currentUser);
    const [zenMode, setZenMode] = useState(false);

    // Calculate stats
    const totalClasses = classes?.length ?? 0;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaysClasses = classes?.filter(c =>
        c.schedule?.some(s => s.day.toLowerCase() === today.toLowerCase())
    ) ?? [];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (locale === 'ar') {
            if (hour < 12) return "صباح الخير";
            if (hour < 17) return "مساء الخير";
            return "مساء النور";
        }
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <RoleGuard requiredRole="teacher">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className={cn("space-y-6 pb-20 transition-all duration-700", zenMode ? "opacity-80 grayscale-[0.3]" : "")}
            >
                {/* Hero Section */}
                <motion.div variants={item} className="relative rounded-[32px] overflow-hidden p-8 text-white min-h-[240px] flex flex-col justify-center border border-white/10 shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay" />

                    {/* Animated Ethereal Orbs */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-emerald-200 text-xs font-bold uppercase tracking-wider border border-white/10 backdrop-blur-md shadow-glow">
                                    <Sparkles className="h-3 w-3" /> {locale === 'ar' ? 'لوحة المعلم' : "Classroom Command"}
                                </span>
                                <button
                                    onClick={() => setZenMode(!zenMode)}
                                    className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold uppercase tracking-wider border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 text-white/60 hover:text-white"
                                >
                                    {zenMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                    {zenMode ? "Exit Zen" : "Zen Mode"}
                                </button>
                            </div>

                            <h1 className="text-5xl font-bold font-amiri leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                                {getGreeting()}, {user?.name?.split(' ')[0] || (locale === 'ar' ? 'معلم' : 'Teacher')}
                            </h1>
                            <p className="text-emerald-100/70 text-lg max-w-xl font-light">
                                {locale === 'ar'
                                    ? `لديك ${todaysClasses.length} حلقات مجدولة اليوم. بارك الله في جهودك.`
                                    : `You have ${todaysClasses.length} classes scheduled for today. May Allah bless your efforts.`
                                }
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link href="/dashboard/teacher/attendance">
                                <button className="glass-pill px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all font-bold flex items-center gap-2 backdrop-blur-md">
                                    <Calendar className="h-5 w-5" />
                                    {locale === 'ar' ? 'الحضور' : 'Attendance'}
                                </button>
                            </Link>
                            <Link href="/halaqa">
                                <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all font-bold flex items-center gap-2 transform hover:scale-105 border border-emerald-400/20">
                                    <Video className="h-5 w-5" />
                                    {locale === 'ar' ? 'ابدأ الفصل' : 'Start Class'}
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* KPI Bento Grid with Holographic Effect */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TeacherMetric
                        title={locale === 'ar' ? 'فصولي' : 'My Classes'}
                        value={classes ? totalClasses.toString() : <Loader2 className="h-6 w-6 animate-spin" />}
                        icon={BookOpen}
                        description={locale === 'ar' ? 'الحلقات النشطة' : 'Active classes'}
                        color="text-violet-400"
                        bg="bg-violet-500/10"
                        border="border-violet-500/20"
                    />
                    <TeacherMetric
                        title={locale === 'ar' ? 'اليوم' : "Today's Schedule"}
                        value={todaysClasses.length.toString()}
                        icon={Calendar}
                        description={locale === 'ar' ? 'فصول قادمة' : 'Upcoming sessions'}
                        color="text-emerald-400"
                        bg="bg-emerald-500/10"
                        border="border-emerald-500/20"
                        highlight={todaysClasses.length > 0}
                    />
                    <TeacherMetric
                        title={locale === 'ar' ? 'نسبة الحضور' : 'Attendance'}
                        value="94%"
                        icon={CheckCircle}
                        description="+2% this week"
                        trend={true}
                        color="text-amber-400"
                        bg="bg-amber-500/10"
                        border="border-amber-500/20"
                    />
                    <TeacherMetric
                        title={locale === 'ar' ? 'الواجبات' : 'Assignments'}
                        value="3"
                        icon={GraduationCap}
                        description="Needs grading"
                        color="text-sky-400"
                        bg="bg-sky-500/10"
                        border="border-sky-500/20"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Schedule Column */}
                    <div className="lg:col-span-8 space-y-6">
                        {todaysClasses.length > 0 ? (
                            <motion.div variants={item}>
                                <div className="glass-card rounded-[32px] p-8 border border-white/10 bg-slate-900/40 backdrop-blur-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                                            <Clock className="h-6 w-6 text-emerald-400" />
                                            {locale === 'ar' ? 'جدول اليوم' : "Today's Schedule"}
                                        </h3>
                                        <span className="text-xs text-emerald-200/80 font-bold px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">
                                            {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 relative z-10">
                                        {todaysClasses.map((cls, idx) => {
                                            const scheduleToday = cls.schedule?.find(s => s.day.toLowerCase() === today.toLowerCase());
                                            return (
                                                <TiltCard key={cls._id} tiltIntensity={5}>
                                                    <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer h-full">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                                                {scheduleToday?.time || 'Scheduled'}
                                                            </div>
                                                            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 border border-white/5">
                                                                <ChevronRight className={cn("h-4 w-4", dir === 'rtl' && "rotate-180")} />
                                                            </div>
                                                        </div>
                                                        <h4 className="font-bold text-xl mb-1 text-white group-hover:text-emerald-300 transition-colors">{cls.name}</h4>
                                                        <p className="text-sm text-white/50">{cls.category} • {cls.subject || 'Quran'}</p>
                                                    </div>
                                                </TiltCard>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div variants={item} className="glass-card rounded-[32px] p-8 text-center flex flex-col items-center justify-center min-h-[250px] border border-white/5 bg-slate-900/40">
                                <div className="h-20 w-20 rounded-full bg-emerald-500/5 flex items-center justify-center mb-6 ring-1 ring-emerald-500/10 animate-pulse-slow">
                                    <Calendar className="h-10 w-10 text-emerald-500/50" />
                                </div>
                                <h3 className="font-bold text-xl text-white/80">No classes scheduled for today</h3>
                                <p className="text-sm text-white/40 max-w-xs mt-2 leading-relaxed">Enjoy your free time or prepare for upcoming sessions using the tools panel.</p>
                            </motion.div>
                        )}

                        {/* Recent Activity or Tools */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <motion.div variants={item} className="h-full">
                                <div className="glass-card rounded-[32px] p-8 h-full flex flex-col justify-center border border-white/10 bg-slate-900/40">
                                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Quick Attendance</h3>
                                    <AttendanceMarker />
                                </div>
                            </motion.div>

                            <motion.div variants={item} className="h-full">
                                <div className="glass-card rounded-[32px] p-8 h-full flex flex-col justify-center border border-white/10 bg-slate-900/40">
                                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Logbook</h3>
                                    <ProgressLogbook />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Tools Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div variants={item} className="glass-card rounded-[32px] p-8 sticky top-24 border border-white/10 bg-slate-900/40 backdrop-blur-xl">
                            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-white">
                                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <Sparkles className="h-5 w-5 text-amber-400" />
                                </div>
                                {locale === 'ar' ? 'أدوات' : 'Classroom Toolkit'}
                            </h3>

                            <div className="space-y-4">
                                <ToolLink
                                    icon={GraduationCap}
                                    title={locale === 'ar' ? 'إدارة الواجبات' : 'Assignment Manager'}
                                    subtitle="Grade & Assign"
                                    color="text-pink-400"
                                    bg="bg-pink-500/10"
                                    border="border-pink-500/20"
                                    href="#assignments"
                                />
                                <ToolLink
                                    icon={MessageSquare}
                                    title={locale === 'ar' ? 'الرسائل' : 'Messages'}
                                    subtitle="Parent Communication"
                                    color="text-blue-400"
                                    bg="bg-blue-500/10"
                                    border="border-blue-500/20"
                                    href="/messages"
                                />
                                <ToolLink
                                    icon={Search}
                                    title={locale === 'ar' ? 'بحث طالب' : 'Student Lookup'}
                                    subtitle="Profiles & History"
                                    color="text-violet-400"
                                    bg="bg-violet-500/10"
                                    border="border-violet-500/20"
                                    href="/halaqa"
                                />
                            </div>

                            <div id="assignments" className="mt-10 pt-8 border-t border-white/5">
                                <AssignmentManager />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </RoleGuard>
    );
}

function TeacherMetric({ title, value, icon: Icon, description, color, highlight, trend, bg, border }: any) {
    return (
        <TiltCard tiltIntensity={8} className="h-full">
            <div className={cn(
                "glass-card p-6 rounded-[24px] relative overflow-hidden group h-full border bg-slate-900/40 backdrop-blur-md transition-all hover:bg-slate-900/60",
                highlight && "ring-1 ring-emerald-500/50 bg-emerald-950/30",
                border
            )}>
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-3 rounded-xl shadow-lg border border-white/5", bg, color)}>
                        <Icon className="h-5 w-5" />
                    </div>
                    {trend && (
                        <div className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-emerald-500/20">
                            <TrendingUp className="h-3 w-3" /> +2%
                        </div>
                    )}
                </div>

                <div className="relative z-10">
                    <div className="text-4xl font-bold font-amiri tracking-tight mb-1 group-hover:scale-105 transition-transform origin-left text-white drop-shadow-sm">
                        {value}
                    </div>
                    <p className="text-xs font-medium text-white/50 uppercase tracking-wider">{title}</p>
                    <p className="text-[10px] text-white/30 mt-2 font-mono border-t border-white/5 pt-2 inline-block w-full">{description}</p>
                </div>

                {/* Holographic Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ backgroundSize: '200% 200%' }} />
            </div>
        </TiltCard>
    );
}

function ToolLink({ icon: Icon, title, subtitle, color, bg, border, href, onClick }: any) {
    const Content = (
        <div
            onClick={onClick}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5 active:scale-[0.98]"
        >
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg border", bg, color, border)}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">{title}</h4>
                <p className="text-xs text-white/40 font-medium">{subtitle}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white transition-colors" />
        </div>
    );

    if (href) {
        return <Link href={href}>{Content}</Link>;
    }

    return Content;
}
