"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ProgressRing } from "@/components/Dashboard/ProgressRing";
import {
    Calendar,
    User,
    Book,
    MessageSquare,
    TrendingUp,
    Sparkles,
    ChevronRight,
    Heart,
    Star,
    DollarSign,
    Activity,
    Clock,
    Shield,
    Trophy,
    CheckCircle,
    Timer,
    Zap,
    Award,
    Flame,
} from "lucide-react";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { ContactAdminModal } from "@/components/Dashboard/ContactAdminModal";
import { TuitionReceiptsModal } from "@/components/Dashboard/TuitionReceiptsModal";
import { BentoGridSkeleton, HeroSkeleton, TimelineEntrySkeleton } from "@/components/ui/skeleton-loaders";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// ── Achievements ──────────────────────────────────────────────────────────────
interface Badge {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    earned: boolean;
}

function computeBadges(attendance: any[], progress: any[], payments: any[]): Badge[] {
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const passRate = progress.length > 0
        ? progress.filter(p => p.status === "Passed").length / progress.length
        : 0;
    const avgRating = progress.length > 0
        ? progress.reduce((s, p) => s + (p.rating ?? 0), 0) / progress.length
        : 0;

    return [
        {
            id: "attendance_hero",
            label: "Perfect Attendee",
            icon: <CheckCircle className="h-4 w-4" />,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
            description: "Attended all recent sessions",
            earned: presentCount >= 5 && attendanceRate(attendance) >= 90,
        },
        {
            id: "mastery",
            label: "Top Performer",
            icon: <Trophy className="h-4 w-4" />,
            color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
            description: "90%+ pass rate in recent sessions",
            earned: passRate >= 0.9,
        },
        {
            id: "five_star",
            label: "5-Star Student",
            icon: <Star className="h-4 w-4 fill-violet-400" />,
            color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
            description: "Average rating of 4.5 or above",
            earned: avgRating >= 4.5,
        },
        {
            id: "paid_up",
            label: "Financially Clear",
            icon: <DollarSign className="h-4 w-4" />,
            color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
            description: "Tuition is up to date",
            earned: payments.length > 0,
        },
        {
            id: "on_fire",
            label: "On a Roll",
            icon: <Flame className="h-4 w-4" />,
            color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
            description: "3+ consecutive 'Passed' entries",
            earned: progress.slice(0, 3).length === 3 && progress.slice(0, 3).every(p => p.status === "Passed"),
        },
    ];
}

function attendanceRate(attendance: any[]): number {
    if (!attendance || attendance.length === 0) return 0;
    return Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100);
}

// ── Countdown timer ───────────────────────────────────────────────────────────
function SessionCountdown({ targetTime }: { targetTime: string }) {
    const [secs, setSecs] = useState(() => {
        const [h, m] = targetTime.split(":").map(Number);
        const now = new Date();
        const target = new Date();
        target.setHours(h ?? 0, m ?? 0, 0, 0);
        return Math.max(0, Math.round((target.getTime() - now.getTime()) / 1000));
    });

    useEffect(() => {
        const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, []);

    if (secs <= 0) return <span className="text-emerald-400 font-bold">Starting now!</span>;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return (
        <span className="font-mono tabular-nums text-violet-200 font-bold">
            {m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}
        </span>
    );
}

    );
}

// ── Progress Trend Chart ─────────────────────────────────────────────────────
function ProgressTrendChart({ data }: { data: any[] }) {
    const chartData = [...data].reverse().map(p => ({
        date: new Date(p.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        rating: p.rating || 0,
        status: p.status === 'Passed' ? 1 : 0.5
    }));

    return (
        <div className="h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke="rgba(255,255,255,0.3)" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis hide domain={[0, 5]} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                        itemStyle={{ color: '#8b5cf6' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="rating" 
                        stroke="#8b5cf6" 
                        strokeWidth={3} 
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ParentDashboard() {
    const { t, locale, dir } = useLanguage();
    // @ts-ignore
    const children = useQuery(api.parent.getChildren);
    const [selectedChildId, setSelectedChildId] = useState<Id<"users"> | null>(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showReceiptsModal, setShowReceiptsModal] = useState(false);
    const user = useQuery(api.users.currentUser);

    useEffect(() => {
        if (children && children.length > 0 && !selectedChildId) {
            setSelectedChildId(children[0]._id);
        }
    }, [children, selectedChildId]);

    const data = useQuery(api.parent.getChildDashboardData,
        selectedChildId ? { studentId: selectedChildId as Id<"users"> } : "skip"
    );

    const selectedChild = children?.find((c: { _id: Id<"users"> }) => c._id === selectedChildId);

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

    const calcAttendanceRate = () => attendanceRate(data?.attendance ?? []);

    // Progress percentage for milestone ring
    const progressPct = data
        ? Math.min(100, Math.round((
            data.progress.filter((p: any) => p.status === "Passed").length /
            Math.max(data.progress.length, 1)
        ) * 100))
        : 0;

    // Badges
    const badges = data ? computeBadges(data.attendance, data.progress, data.payments) : [];
    const earnedBadges = badges.filter(b => b.earned);

    // Next class from schedule
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaySchedule = (data?.currentClass as any)?.schedule?.find(
        (s: any) => s.day?.toLowerCase() === today.toLowerCase()
    );
    const minsUntilClass = todaySchedule?.time
        ? (() => {
            const [h, m] = todaySchedule.time.split(":").map(Number);
            const target = new Date(); target.setHours(h ?? 0, m ?? 0, 0, 0);
            return Math.round((target.getTime() - Date.now()) / 60000);
        })()
        : null;
    const hasLiveClass = minsUntilClass !== null && minsUntilClass <= 0 && minsUntilClass > -60;
    const hasUpcomingClass = minsUntilClass !== null && minsUntilClass > 0 && minsUntilClass <= 60;

    const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

    return (
        <RoleGuard requiredRole="parent">
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-20">

                {/* Hero */}
                <motion.div variants={item} className="relative rounded-[32px] overflow-hidden p-8 text-white min-h-[240px] flex flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                    <div className="absolute bottom-0 right-0 opacity-10 transform translate-x-12 translate-y-12">
                        <Heart className="h-64 w-64" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-100 text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-md">
                                <Sparkles className="h-3 w-3" /> {locale === 'ar' ? 'بوابة ولي الأمر' : "Parent Portal"}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold font-amiri leading-tight">
                                {getGreeting()}, {user?.name?.split(' ')[0] || (locale === 'ar' ? 'ولي الأمر' : 'Parent')}
                            </h1>
                            <p className="text-purple-100/90 text-lg max-w-xl">
                                {locale === 'ar'
                                    ? `تابع تقدم أطفالك الأكاديمي والروحي.`
                                    : `Clean insights into your children's academic and spiritual growth.`
                                }
                            </p>
                        </div>

                        {children && children.length > 0 && (
                            <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20">
                                {(children as { _id: Id<"users">; name: string }[]).map((child) => (
                                    <button
                                        key={child._id}
                                        onClick={() => setSelectedChildId(child._id)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold text-sm",
                                            selectedChildId === child._id
                                                ? "bg-white text-violet-700 shadow-lg"
                                                : "text-white/80 hover:bg-white/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-6 w-6 rounded-full flex items-center justify-center text-[10px]",
                                            selectedChildId === child._id ? "bg-violet-100 text-violet-700" : "bg-white/20"
                                        )}>
                                            {child.name.charAt(0)}
                                        </div>
                                        <span className="hidden sm:inline">{child.name.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {!selectedChildId ? (
                    <motion.div variants={item} className="text-center py-20 rounded-[32px] bg-background/50 border border-dashed border-border flex flex-col items-center">
                        <div className="h-20 w-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                            <User className="h-10 w-10 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Children Linked</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Please contact administration to link your child's account to your profile.</p>
                        <button onClick={() => setShowContactModal(true)} className="glass-pill px-6 py-2 bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                            Contact Admin
                        </button>
                    </motion.div>
                ) : !data ? (
                    <div className="space-y-6">
                        <HeroSkeleton />
                        <BentoGridSkeleton cols={4} />
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-8 space-y-6">
                                <div className="glass-card rounded-[32px] p-6 h-64 flex flex-col gap-4">
                                    <TimelineEntrySkeleton />
                                    <TimelineEntrySkeleton />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedChildId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* 🔴 Live / Upcoming Class Banner */}
                            <AnimatePresence>
                                {(hasLiveClass || hasUpcomingClass) && data.currentClass && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={cn(
                                            "rounded-[24px] border p-5 flex items-center justify-between gap-4 overflow-hidden relative",
                                            hasLiveClass
                                                ? "bg-red-950/40 border-red-500/30"
                                                : "bg-violet-950/40 border-violet-500/30"
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-transparent pointer-events-none" />
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center",
                                                hasLiveClass ? "bg-red-500/20" : "bg-violet-500/20"
                                            )}>
                                                {hasLiveClass
                                                    ? <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" /></span>
                                                    : <Timer className="h-5 w-5 text-violet-400" />
                                                }
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest text-white/50">
                                                    {hasLiveClass ? "🔴 Live Session" : `⏳ ${selectedChild?.name?.split(" ")[0]}'s Next Session`}
                                                </p>
                                                <p className="font-bold text-white">{(data.currentClass as any).name}</p>
                                            </div>
                                        </div>
                                        <div className="relative z-10 flex items-center gap-3">
                                            {hasUpcomingClass && todaySchedule?.time && (
                                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                                                    <Clock className="h-4 w-4 text-violet-300" />
                                                    <SessionCountdown targetTime={todaySchedule.time} />
                                                    <span className="text-xs text-white/30">left</span>
                                                </div>
                                            )}
                                            <Link href="/halaqa">
                                                <button className={cn(
                                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105",
                                                    hasLiveClass
                                                        ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                                        : "bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                                                )}>
                                                    <Zap className="h-4 w-4" />
                                                    {hasLiveClass ? "Join Live" : "Prepare"}
                                                </button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* KPI Bento Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <ParentBentoCard
                                    title={locale === 'ar' ? 'التقدم الحالي' : 'Session Progress'}
                                    value={data.progress[0]?.surahName || data.progress[0]?.topic || "Starting"}
                                    icon={Book}
                                    sub={data.progress[0]?.status || "On Track"}
                                    color="bg-emerald-500"
                                    chart={<ProgressRing progress={progressPct} label="Progress" subLabel={`${progressPct}%`} />}
                                />
                                <ParentBentoCard
                                    title={locale === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}
                                    value={`${calcAttendanceRate()}%`}
                                    icon={Calendar}
                                    sub={calcAttendanceRate() > 90 ? "Excellent" : "Needs Attention"}
                                    color="bg-blue-500"
                                    trend={true}
                                />
                                <ParentBentoCard
                                    title={locale === 'ar' ? 'حالة الرسوم' : 'Tuition Status'}
                                    value={data.payments.length > 0 ? "Paid" : "Due"}
                                    icon={DollarSign}
                                    sub={data.payments[0]?.month || "Current Month"}
                                    color={data.payments.length > 0 ? "bg-amber-500" : "bg-red-500"}
                                    onClick={() => setShowReceiptsModal(true)}
                                />
                                <ParentBentoCard
                                    title={locale === 'ar' ? 'الإنجازات' : 'Badges Earned'}
                                    value={`${earnedBadges.length}/${badges.length}`}
                                    icon={Award}
                                    sub={earnedBadges.length > 0 ? earnedBadges[0].label : "Keep going!"}
                                    color="bg-pink-500"
                                />
                            </div>

                            {/* Achievement Badges */}
                            {badges.length > 0 && (
                                <motion.div variants={item} className="glass-card rounded-[32px] p-6 border border-white/10 bg-slate-900/40">
                                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-amber-400" />
                                        {locale === 'ar' ? 'الإنجازات والأوسمة' : 'Achievement Badges'}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {badges.map(badge => (
                                            <motion.div
                                                key={badge.id}
                                                whileHover={{ scale: 1.05 }}
                                                title={badge.description}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all",
                                                    badge.earned
                                                        ? badge.color
                                                        : "bg-white/5 border-white/10 text-white/20 grayscale opacity-40"
                                                )}
                                            >
                                                {badge.icon}
                                                {badge.label}
                                                {badge.earned && <Sparkles className="h-3 w-3 opacity-60" />}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Main Content Split */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                <div className="lg:col-span-8 space-y-6">

                                    {/* Class Info Banner */}
                                    {data.currentClass && (
                                        <motion.div variants={item} className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 rounded-2xl p-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-violet-300">Current Class</h3>
                                                <p className="text-2xl font-bold text-white">{(data.currentClass as any).name}</p>
                                                <p className="text-sm text-violet-200/60">{(data.currentClass as any).category} • {(data.currentClass as any).subject || 'General'}</p>
                                            </div>
                                            <div className="h-12 w-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                                                <Book className="h-6 w-6 text-violet-300" />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Recent Exams */}
                                    {data.exams && data.exams.length > 0 && (
                                        <motion.div variants={item} className="glass-card rounded-[32px] p-6">
                                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                                                <TrendingUp className="h-5 w-5 text-amber-500" />
                                                {locale === 'ar' ? 'نتائج الامتحانات' : 'Performance Trend'}
                                            </h3>
                                            <ProgressTrendChart data={data.progress} />
                                            <div className="space-y-4 mt-6">
                                                {data.exams.map((exam: any, i: number) => {
                                                    const pct = Math.round((exam.marksObtained / exam.totalMarks) * 100);
                                                    return (
                                                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h4 className="font-bold text-white">{exam.examTitle}</h4>
                                                                    <p className="text-xs text-white/50">{new Date(exam.date).toLocaleDateString()}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className={cn(
                                                                        "text-lg font-bold",
                                                                        pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-red-400"
                                                                    )}>{pct}%</span>
                                                                    <p className="text-[10px] text-white/40">{exam.marksObtained}/{exam.totalMarks}</p>
                                                                </div>
                                                            </div>
                                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                                                                <div
                                                                    className={cn("h-full rounded-full", pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500")}
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Academic Timeline */}
                                    <motion.div variants={item} className="glass-card rounded-[32px] p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold flex items-center gap-2">
                                                <Activity className="h-5 w-5 text-emerald-500" />
                                                {locale === 'ar' ? 'السجل الأكاديمي' : 'Academic Timeline'}
                                            </h3>
                                        </div>

                                        <div className="relative border-l-2 border-border/50 ml-3 space-y-6 pb-4">
                                            {data.progress.map((log: any, idx: number) => (
                                                <div key={log._id} className="relative pl-6">
                                                    <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-background" />
                                                    <div className="p-4 rounded-2xl bg-accent/20 border border-border/50 hover:bg-accent/40 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-bold text-foreground">{log.surahName || log.topic || "Session"}</h4>
                                                                {log.ayahStart && <p className="text-xs text-muted-foreground">Ayah {log.ayahStart} - {log.ayahEnd}</p>}
                                                            </div>
                                                            <span className={cn(
                                                                "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                                                                log.status === 'Passed' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                                            )}>
                                                                {log.status}
                                                            </span>
                                                        </div>

                                                        {/* Teacher feedback highlight */}
                                                        {log.notes && (
                                                            <div className="mt-3 p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 flex items-start gap-2">
                                                                <MessageSquare className="h-3.5 w-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                                                                <p className="text-xs text-violet-200/80 italic">{log.notes}</p>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map(s => (
                                                                    <Star key={s} className={cn("h-3 w-3", s <= (log.rating || 0) ? "fill-amber-400 text-amber-400" : "text-border")} />
                                                                ))}
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground ml-auto">
                                                                {new Date(log.date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {data.progress.length === 0 && (
                                                <div className="text-center py-12 text-muted-foreground italic">
                                                    No academic records found yet.
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Sidebar */}
                                <div className="lg:col-span-4 space-y-6">
                                    {/* Attendance List */}
                                    <motion.div variants={item} className="glass-card rounded-[32px] p-6">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-blue-500" />
                                            Recent Attendance
                                        </h3>
                                        <div className="space-y-3">
                                            {data.attendance.slice(0, 5).map((att: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/20">
                                                    <span className="text-xs font-bold">{new Date(att.date).toLocaleDateString()}</span>
                                                    <span className={cn(
                                                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                                                        att.status === 'present' ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                                                    )}>
                                                        {att.status}
                                                    </span>
                                                </div>
                                            ))}
                                            {data.attendance.length === 0 && (
                                                <p className="text-xs text-center text-muted-foreground py-4">No attendance records yet.</p>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Best Rating Callout */}
                                    {data.progress.length > 0 && (() => {
                                        const best = [...data.progress].sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0))[0];
                                        if (!best || (best.rating ?? 0) < 4) return null;
                                        return (
                                            <motion.div
                                                variants={item}
                                                className="glass-card rounded-[32px] p-6 bg-gradient-to-br from-amber-900/40 to-orange-900/20 border border-amber-500/20"
                                            >
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Flame className="h-5 w-5 text-amber-400" />
                                                    <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Teacher Praise</span>
                                                </div>
                                                <div className="flex gap-0.5 mb-3">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} className={cn("h-4 w-4", s <= (best.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-white/10")} />
                                                    ))}
                                                </div>
                                                {best.notes && (
                                                    <p className="text-sm text-amber-100/80 italic leading-relaxed">"{best.notes}"</p>
                                                )}
                                                <p className="text-[10px] text-amber-500/50 mt-3 uppercase tracking-wider font-bold">
                                                    {best.surahName || best.topic || "Latest Session"} • {best.date}
                                                </p>
                                            </motion.div>
                                        );
                                    })()}

                                    {/* Quick Contact */}
                                    <motion.div variants={item} className="glass-card rounded-[32px] p-6 bg-gradient-to-br from-violet-600 to-purple-700 text-white">
                                        <Shield className="h-8 w-8 mb-4 opacity-50" />
                                        <h3 className="font-bold text-lg mb-2">Need Assistance?</h3>
                                        <p className="text-sm text-purple-100 mb-6 opacity-80">
                                            Contact administration for queries regarding fees, transport, or absences.
                                        </p>
                                        <button onClick={() => setShowContactModal(true)} className="w-full py-3 rounded-xl bg-white text-purple-700 font-bold text-sm hover:bg-purple-50 transition-colors">
                                            Contact School
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </motion.div>
            <ContactAdminModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
            <TuitionReceiptsModal 
                isOpen={showReceiptsModal} 
                onClose={() => setShowReceiptsModal(false)} 
                payments={data?.payments || []}
                studentName={selectedChild?.name}
            />
        </RoleGuard>
    );
}

function ParentBentoCard({ title, value, icon: Icon, sub, color, chart, trend, link, onClick }: any) {
    const CardContent = (
        <div 
            onClick={onClick}
            className={cn(
                "glass-card p-5 rounded-[24px] relative overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between",
                onClick && "cursor-pointer active:scale-95"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl text-white shadow-md", color)}>
                    <Icon className="h-5 w-5" />
                </div>
                {chart && <div className="scale-75 origin-top-right">{chart}</div>}
            </div>
            <div>
                <div className="text-2xl font-bold font-amiri tracking-tight text-foreground">{value}</div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mt-1">{title}</p>
                <div className="flex items-center gap-1 mt-1">
                    {trend && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                    <p className="text-[10px] text-muted-foreground/70">{sub}</p>
                </div>
            </div>
        </div>
    );

    if (link) {
        return <Link href={link} className="block h-full">{CardContent}</Link>;
    }
    return <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }} className="h-full">{CardContent}</motion.div>;
}
