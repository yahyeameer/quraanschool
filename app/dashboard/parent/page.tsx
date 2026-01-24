"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/Dashboard/ProgressRing";
import {
    Bell,
    Calendar,
    User,
    Book,
    CheckCircle,
    Clock,
    DollarSign,
    MessageSquare,
    TrendingUp,
    Sparkles,
    ChevronRight,
    Heart,
    Star,
    GraduationCap,
    Loader2
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

    // Calculate attendance percentage
    const calculateAttendanceRate = () => {
        if (!data?.attendance || data.attendance.length === 0) return 0;
        const presentCount = data.attendance.filter((a: any) => a.status === 'present').length;
        return Math.round((presentCount / data.attendance.length) * 100);
    };

    return (
        <RoleGuard requiredRole="parent">
            <div className="space-y-8">
                {/* Hero Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-500 text-white p-8 shadow-2xl"
                >
                    {/* Background decorations */}
                    <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute right-10 bottom-10 opacity-10">
                        <Heart className="h-32 w-32" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-purple-100">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-sm font-medium uppercase tracking-wider">
                                    {locale === 'ar' ? 'بوابة ولي الأمر' : "Parent Portal"}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold font-amiri">
                                {getGreeting()}, {user?.name?.split(' ')[0] || (locale === 'ar' ? 'ولي الأمر' : 'Parent')}!
                            </h1>
                            <p className="text-purple-100 max-w-md">
                                {locale === 'ar'
                                    ? `تابع تقدم أطفالك في حفظ القرآن الكريم وتعلم العلوم الإسلامية.`
                                    : `Monitor your children's progress in Quran memorization and Islamic education.`
                                }
                            </p>
                        </div>

                        {/* Child Selector */}
                        {children && children.length > 1 && (
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                                {(children as any[]).map((child) => (
                                    <button
                                        key={child._id}
                                        onClick={() => setSelectedChildId(child._id)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                                            selectedChildId === child._id
                                                ? "bg-white text-purple-600 shadow-lg"
                                                : "text-white hover:bg-white/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm",
                                            selectedChildId === child._id
                                                ? "bg-purple-100 text-purple-600"
                                                : "bg-white/20"
                                        )}>
                                            {child.name.charAt(0)}
                                        </div>
                                        <span className="font-medium hidden sm:inline">{child.name.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {!selectedChildId ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 border-2 border-dashed rounded-3xl bg-background/50 backdrop-blur-xl"
                    >
                        <div className="h-20 w-20 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                            <User className="h-10 w-10 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            {locale === 'ar' ? 'لا يوجد أطفال مرتبطين' : 'No Children Linked'}
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            {locale === 'ar'
                                ? 'يرجى التواصل مع الإدارة لربط حساب طفلك بحسابك.'
                                : 'Please contact administration to link your child\'s account to your profile.'
                            }
                        </p>
                        <Button onClick={() => setShowContactModal(true)} className="mt-6 rounded-xl" variant="outline">
                            <MessageSquare className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                            {locale === 'ar' ? 'تواصل مع الإدارة' : 'Contact Admin'}
                        </Button>
                    </motion.div>
                ) : !data ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                        <p className="text-muted-foreground">
                            {locale === 'ar' ? 'جاري تحميل البيانات...' : 'Loading child data...'}
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedChildId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Selected Child Info Banner */}
                            {selectedChild && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20"
                                >
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {selectedChild.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{selectedChild.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {locale === 'ar' ? 'طالب نشط' : 'Active Student'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 text-sm font-medium">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span>{selectedChild.streak || 0} {locale === 'ar' ? 'يوم' : 'day streak'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Stats Grid */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Progress Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 h-full">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {locale === 'ar' ? 'التقدم اليومي' : 'Daily Progress'}
                                                </p>
                                                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                    <Book className="h-5 w-5 text-emerald-500" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <ProgressRing
                                                    progress={65}
                                                    label={data.progress[0]?.surahName || (locale === 'ar' ? "البداية..." : "Starting...")}
                                                    subLabel={data.progress[0]?.status || (locale === 'ar' ? "نشط" : "Active")}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Attendance Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 h-full">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {locale === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}
                                                </p>
                                                <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                    <Calendar className="h-5 w-5 text-blue-500" />
                                                </div>
                                            </div>
                                            <p className="text-4xl font-bold text-blue-600">{calculateAttendanceRate()}%</p>
                                            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                                                <TrendingUp className="h-3 w-3" />
                                                <span>{locale === 'ar' ? 'ممتاز' : 'Excellent'}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Payments Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5 h-full">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {locale === 'ar' ? 'حالة الرسوم' : 'Tuition Status'}
                                                </p>
                                                <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                                    <DollarSign className="h-5 w-5 text-amber-500" />
                                                </div>
                                            </div>
                                            {data.payments.length > 0 ? (
                                                <>
                                                    <p className="text-3xl font-bold text-amber-600">${data.payments[0]?.amount}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {data.payments[0]?.month}
                                                    </p>
                                                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                                                        {locale === 'ar' ? 'مدفوع' : 'PAID'}
                                                    </span>
                                                </>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    {locale === 'ar' ? 'لا توجد بيانات' : 'No payment data'}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Communication Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5 h-full group cursor-pointer hover:shadow-lg transition-all">
                                        <Link href="/messages">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        {locale === 'ar' ? 'الرسائل' : 'Messages'}
                                                    </p>
                                                    <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <MessageSquare className="h-5 w-5 text-purple-500" />
                                                    </div>
                                                </div>
                                                <p className="text-3xl font-bold">0</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {locale === 'ar' ? 'رسائل جديدة' : 'New messages'}
                                                </p>
                                                <ChevronRight className={cn(
                                                    "absolute bottom-6 h-5 w-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-all",
                                                    dir === 'rtl' ? "left-6 rotate-180" : "right-6"
                                                )} />
                                            </CardContent>
                                        </Link>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Recent Activity Grid */}
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Attendance History */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Card className="border-0 bg-background/50 backdrop-blur-xl shadow-xl h-full">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                <div className="h-9 w-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                    <Calendar className="h-4 w-4 text-blue-500" />
                                                </div>
                                                {locale === 'ar' ? 'سجل الحضور' : 'Attendance History'}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {data.attendance.slice(0, 5).map((att: any, i: number) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 * i }}
                                                        className="flex items-center justify-between p-3 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                                <Calendar className="h-4 w-4 text-blue-500" />
                                                            </div>
                                                            <span className="text-sm font-medium">
                                                                {new Date(att.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-[10px] uppercase font-bold",
                                                            att.status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                                att.status === 'late' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                                    'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                                        )}>
                                                            {att.status === 'present' ? (locale === 'ar' ? 'حاضر' : 'Present') :
                                                                att.status === 'late' ? (locale === 'ar' ? 'متأخر' : 'Late') :
                                                                    (locale === 'ar' ? 'غائب' : 'Absent')}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                                {data.attendance.length === 0 && (
                                                    <div className="text-center py-8 text-muted-foreground">
                                                        <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                                        <p className="text-sm">{locale === 'ar' ? 'لا توجد سجلات' : 'No records found'}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Payment History */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Card className="border-0 bg-background/50 backdrop-blur-xl shadow-xl h-full">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                    <DollarSign className="h-4 w-4 text-emerald-500" />
                                                </div>
                                                {locale === 'ar' ? 'سجل المدفوعات' : 'Payment History'}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {data.payments.map((p: any, i: number) => (
                                                    <motion.div
                                                        key={p._id}
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 * i }}
                                                        className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-bold">{p.month}</p>
                                                            <p className="text-[10px] text-muted-foreground">
                                                                {new Date(p.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-emerald-600">${p.amount}</p>
                                                            <span className="text-[9px] uppercase font-bold text-emerald-500">
                                                                {locale === 'ar' ? 'مدفوع' : 'PAID'}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                {data.payments.length === 0 && (
                                                    <div className="text-center py-8 border-2 border-dashed rounded-xl text-muted-foreground">
                                                        <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                                        <p className="text-sm">{locale === 'ar' ? 'لا يوجد سجل مدفوعات' : 'No payment history'}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Academic Logbook */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <Card className="border-0 bg-background/50 backdrop-blur-xl shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                                <GraduationCap className="h-5 w-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <span className="text-lg font-bold">
                                                    {locale === 'ar' ? 'السجل الأكاديمي' : 'Academic Logbook'}
                                                </span>
                                                <p className="text-xs text-muted-foreground font-normal">
                                                    {locale === 'ar' ? 'تفاصيل التلاوات وملاحظات المعلم' : 'Detailed recitation history and teacher notes'}
                                                </p>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {data.progress.map((log: any, idx: number) => (
                                                <motion.div
                                                    key={log._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 * idx }}
                                                    className="flex gap-4 p-4 rounded-2xl border hover:bg-accent/5 transition-colors group"
                                                >
                                                    <div className="rounded-2xl bg-primary/10 h-12 w-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                        <Book className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1 gap-2">
                                                            <h4 className="font-bold truncate">{log.surahName}</h4>
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                {new Date(log.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {locale === 'ar' ? 'الآيات' : 'Ayah'} {log.ayahStart} - {log.ayahEnd}
                                                        </p>
                                                        {log.notes && (
                                                            <p className="mt-2 text-xs text-muted-foreground italic border-s-2 ps-3 py-1">
                                                                "{log.notes}"
                                                            </p>
                                                        )}
                                                        {/* Rating stars */}
                                                        <div className="flex items-center gap-1 mt-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={cn(
                                                                        "h-3 w-3",
                                                                        star <= (log.rating || 0)
                                                                            ? "text-amber-400 fill-amber-400"
                                                                            : "text-muted-foreground/30"
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0">
                                                        <span className={cn(
                                                            "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                                                            log.status === 'Passed'
                                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                                        )}>
                                                            {log.status === 'Passed'
                                                                ? (locale === 'ar' ? 'ناجح' : 'Passed')
                                                                : (locale === 'ar' ? 'يحتاج مراجعة' : 'Review')}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {data.progress.length === 0 && (
                                                <div className="text-center py-12 text-muted-foreground">
                                                    <Book className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                                    <p>{locale === 'ar' ? 'لا توجد سجلات أكاديمية بعد' : 'No academic records yet'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
            <ContactAdminModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
        </RoleGuard>
    );
}
