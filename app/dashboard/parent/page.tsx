"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
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
    Shield
} from "lucide-react";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { ContactAdminModal } from "@/components/Dashboard/ContactAdminModal";
import { Id } from "@/convex/_generated/dataModel";

export default function ParentDashboard() {
    const { t, locale, dir } = useLanguage();
    // @ts-ignore
    const children = useQuery(api.parent.getChildren);
    const [selectedChildId, setSelectedChildId] = useState<Id<"users"> | null>(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const user = useQuery(api.users.currentUser);

    // Automatically select first child if none selected
    if (children && children.length > 0 && !selectedChildId) {
        setSelectedChildId(children[0]._id);
    }

    // @ts-ignore
    const data = useQuery(api.parent.getChildDashboardData,
        selectedChildId ? { studentId: selectedChildId as any } : "skip"
    );

    const selectedChild = children?.find((c: any) => c._id === selectedChildId);

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

    const calculateAttendanceRate = () => {
        if (!data?.attendance || data.attendance.length === 0) return 0;
        const presentCount = data.attendance.filter((a: any) => a.status === 'present').length;
        return Math.round((presentCount / data.attendance.length) * 100);
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
        <RoleGuard requiredRole="parent">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6 pb-20"
            >
                {/* Hero Section */}
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
                                    ? `تابع تقدم أطفالك في حفظ القرآن الكريم وتعلم العلوم الإسلامية.`
                                    : `Clean insights into your children's spiritual and academic growth.`
                                }
                            </p>
                        </div>

                        {/* Child Selector in Hero */}
                        {children && children.length > 0 && (
                            <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20">
                                {(children as any[]).map((child) => (
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
                                            selectedChildId === child._id
                                                ? "bg-violet-100 text-violet-700"
                                                : "bg-white/20"
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
                    <motion.div variants={item} className="flex justify-center py-20">
                        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedChildId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* KPI Bento Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <ParentBentoCard
                                    title={locale === 'ar' ? 'التقدم اليومي' : 'Current Progress'}
                                    value={data.progress[0]?.surahName || "Starting"}
                                    icon={Book}
                                    sub={data.progress[0]?.status || "On Track"}
                                    color="bg-emerald-500"
                                    chart={<ProgressRing progress={65} label="Progress" subLabel="65%" />}
                                />
                                <ParentBentoCard
                                    title={locale === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}
                                    value={`${calculateAttendanceRate()}%`}
                                    icon={Calendar}
                                    sub={calculateAttendanceRate() > 90 ? "Excellent" : "Needs Attention"}
                                    color="bg-blue-500"
                                    trend={true}
                                />
                                <ParentBentoCard
                                    title={locale === 'ar' ? 'حالة الرسوم' : 'Tuition Status'}
                                    value={data.payments.length > 0 ? "Paid" : "Due"}
                                    icon={DollarSign}
                                    sub={data.payments[0]?.month || "Current Month"}
                                    color={data.payments.length > 0 ? "bg-amber-500" : "bg-red-500"}
                                />
                                <ParentBentoCard
                                    title={locale === 'ar' ? 'الرسائل' : 'Messages'}
                                    value="0"
                                    icon={MessageSquare}
                                    sub="Inbox Clear"
                                    color="bg-pink-500"
                                    link="/messages"
                                />
                            </div>

                            {/* Main Content Split */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Exams & Results Section */}
                                <div className="lg:col-span-8 space-y-6">
                                    {/* Class Info Banner */}
                                    {data.currentClass && (
                                        <motion.div variants={item} className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 rounded-2xl p-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-violet-300">Current Class</h3>
                                                <p className="text-2xl font-bold text-white">{data.currentClass.name}</p>
                                                <p className="text-sm text-violet-200/60">{data.currentClass.category} • {data.currentClass.subject || 'General'}</p>
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
                                                {locale === 'ar' ? 'نتائج الامتحانات' : 'Recent Exam Results'}
                                            </h3>
                                            <div className="space-y-4">
                                                {data.exams.map((exam: any, i: number) => {
                                                    const percentage = Math.round((exam.marksObtained / exam.totalMarks) * 100);
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
                                                                        percentage >= 80 ? "text-emerald-400" :
                                                                            percentage >= 60 ? "text-amber-400" : "text-red-400"
                                                                    )}>
                                                                        {percentage}%
                                                                    </span>
                                                                    <p className="text-[10px] text-white/40">{exam.marksObtained}/{exam.totalMarks}</p>
                                                                </div>
                                                            </div>
                                                            {/* Progress Bar */}
                                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                                                                <div
                                                                    className={cn("h-full rounded-full",
                                                                        percentage >= 80 ? "bg-emerald-500" :
                                                                            percentage >= 60 ? "bg-amber-500" : "bg-red-500"
                                                                    )}
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Academic Logbook */}
                                    <motion.div variants={item} className="glass-card rounded-[32px] p-6 h-full">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold flex items-center gap-2">
                                                <Activity className="h-5 w-5 text-emerald-500" />
                                                {locale === 'ar' ? 'السجل الأكاديمي' : 'Academic Timeline'}
                                            </h3>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 rounded-full text-xs font-bold bg-accent hover:bg-accent/80 transition-colors">All</button>
                                                <button className="px-3 py-1 rounded-full text-xs font-bold bg-accent/30 text-muted-foreground hover:bg-accent/80 transition-colors">Memorization</button>
                                            </div>
                                        </div>

                                        <div className="relative border-l-2 border-border/50 ml-3 space-y-6 pb-4">
                                            {data.progress.map((log: any, idx: number) => (
                                                <div key={log._id} className="relative pl-6">
                                                    <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-background" />
                                                    <div className="p-4 rounded-2xl bg-accent/20 border border-border/50 hover:bg-accent/40 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-bold text-foreground">{log.surahName}</h4>
                                                                <p className="text-xs text-muted-foreground">Ayah {log.ayahStart} - {log.ayahEnd}</p>
                                                            </div>
                                                            <span className={cn(
                                                                "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                                                                log.status === 'Passed' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                                            )}>
                                                                {log.status}
                                                            </span>
                                                        </div>
                                                        {log.notes && (
                                                            <p className="text-sm text-foreground/80 italic bg-background/50 p-2 rounded-lg border border-border/20">
                                                                "{log.notes}"
                                                            </p>
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

                                {/* Sidebar Stats */}
                                <div className="lg:col-span-4 space-y-6">
                                    {/* Attendance Mini-List */}
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
                                        </div>
                                    </motion.div>

                                    {/* Quick Contact */}
                                    <motion.div variants={item} className="glass-card rounded-[32px] p-6 bg-gradient-to-br from-violet-600 to-purple-700 text-white">
                                        <Shield className="h-8 w-8 mb-4 opacity-50" />
                                        <h3 className="font-bold text-lg mb-2">Need Assistance?</h3>
                                        <p className="text-sm text-purple-100 mb-6 opacity-80">
                                            Contact the administration for queries regarding fees, transport, or unexpected absences.
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
        </RoleGuard>
    );
}

function ParentBentoCard({ title, value, icon: Icon, sub, color, chart, trend, link }: any) {
    const CardContent = (
        <div className="glass-card p-5 rounded-[24px] relative overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
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
