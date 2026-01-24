"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AttendanceMarker } from "@/components/Teacher/AttendanceMarker";
import { ProgressLogbook } from "@/components/Teacher/ProgressLogbook";
import { AssignmentManager } from "@/components/Teacher/AssignmentManager";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    TrendingUp,
    Sparkles,
    ChevronRight,
    GraduationCap,
    Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

export default function TeacherDashboard() {
    const { t, locale, dir } = useLanguage();
    const classes = useQuery(api.teacher.getMyClasses);
    const user = useQuery(api.users.currentUser);

    // Calculate stats
    const totalClasses = classes?.length ?? 0;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaysClasses = classes?.filter(c =>
        c.schedule?.some(s => s.day.toLowerCase() === today.toLowerCase())
    ) ?? [];

    // Get greeting based on time
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

    return (
        <RoleGuard requiredRole="teacher">
            <div className="space-y-8">
                {/* Hero Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white p-8 shadow-2xl"
                >
                    {/* Background decorations */}
                    <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute right-10 bottom-10 opacity-10">
                        <GraduationCap className="h-32 w-32" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-100">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-sm font-medium uppercase tracking-wider">
                                    {locale === 'ar' ? 'لوحة المعلم' : "Teacher's Cockpit"}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold font-amiri">
                                {getGreeting()}, {user?.name?.split(' ')[0] || (locale === 'ar' ? 'معلم' : 'Teacher')}!
                            </h1>
                            <p className="text-emerald-100 max-w-md">
                                {locale === 'ar'
                                    ? `لديك ${todaysClasses.length} حلقات مجدولة اليوم. بارك الله في جهودك.`
                                    : `You have ${todaysClasses.length} classes scheduled for today. May Allah bless your efforts.`
                                }
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link href="/dashboard/teacher/attendance">
                                <Button
                                    size="lg"
                                    className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm rounded-xl"
                                >
                                    <Calendar className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                    {locale === 'ar' ? 'الحضور' : 'Attendance'}
                                </Button>
                            </Link>
                            <Link href="/halaqa">
                                <Button
                                    size="lg"
                                    className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold shadow-lg"
                                >
                                    <BookOpen className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                    {locale === 'ar' ? 'فصولي' : 'My Classes'}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-500/10 to-purple-500/5 hover:from-violet-500/20 hover:to-purple-500/10 transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {locale === 'ar' ? 'فصولي' : 'My Classes'}
                                        </p>
                                        <p className="text-3xl font-bold mt-1">
                                            {classes === undefined ? (
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            ) : totalClasses}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <BookOpen className="h-6 w-6 text-violet-500" />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {locale === 'ar' ? 'الحلقات النشطة' : 'Active classes'}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 hover:from-emerald-500/20 hover:to-teal-500/10 transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {locale === 'ar' ? 'اليوم' : "Today's Classes"}
                                        </p>
                                        <p className="text-3xl font-bold mt-1">{todaysClasses.length}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Calendar className="h-6 w-6 text-emerald-500" />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {locale === 'ar' ? `فصول ${today}` : `${today}'s schedule`}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5 hover:from-amber-500/20 hover:to-orange-500/10 transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {locale === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}
                                        </p>
                                        <p className="text-3xl font-bold mt-1 text-amber-600">94%</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <CheckCircle className="h-6 w-6 text-amber-500" />
                                    </div>
                                </div>
                                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2">
                                    <TrendingUp className="h-3 w-3" />
                                    {locale === 'ar' ? '+2% هذا الأسبوع' : '+2% this week'}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 hover:from-blue-500/20 hover:to-indigo-500/10 transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {locale === 'ar' ? 'الواجبات النشطة' : 'Active Assignments'}
                                        </p>
                                        <p className="text-3xl font-bold mt-1">3</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <GraduationCap className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {locale === 'ar' ? 'واجبات جارية' : 'Pending review'}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Today's Schedule */}
                {todaysClasses.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="border-0 bg-background/50 backdrop-blur-xl shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <span className="text-lg font-bold">
                                            {locale === 'ar' ? 'جدول اليوم' : "Today's Schedule"}
                                        </span>
                                        <p className="text-xs text-muted-foreground font-normal">
                                            {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {todaysClasses.map((cls, idx) => {
                                        const scheduleToday = cls.schedule?.find(s =>
                                            s.day.toLowerCase() === today.toLowerCase()
                                        );
                                        return (
                                            <motion.div
                                                key={cls._id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 * idx }}
                                                className={cn(
                                                    "group relative p-4 rounded-2xl border bg-gradient-to-br transition-all duration-300 cursor-pointer hover:shadow-lg",
                                                    "from-white/5 to-transparent hover:from-emerald-500/10 hover:to-transparent",
                                                    "border-white/10 hover:border-emerald-500/30"
                                                )}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                                                            {cls.name}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {cls.category} • {cls.subject || 'Quran'}
                                                        </p>
                                                    </div>
                                                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold">
                                                        {scheduleToday?.time || 'Scheduled'}
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Users className="h-3 w-3" />
                                                    <span>{locale === 'ar' ? 'طلاب مسجلين' : 'Enrolled students'}</span>
                                                </div>
                                                <ChevronRight className={cn(
                                                    "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all",
                                                    dir === 'rtl' ? "left-4 rotate-180" : "right-4"
                                                )} />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Main Tools Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                        {locale === 'ar' ? 'أدوات التدريس' : 'Teaching Tools'}
                    </h3>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <AttendanceMarker />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <ProgressLogbook />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <AssignmentManager />
                    </motion.div>
                </div>
            </div>
        </RoleGuard>
    );
}
