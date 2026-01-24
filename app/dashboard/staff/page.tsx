"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Users,
    Search,
    CreditCard,
    UserPlus,
    FileText,
    Calendar,
    CheckCircle,
    Clock,
    Loader2,
    Sparkles,
    ChevronRight,
    Phone,
    Mail,
    Building,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

export default function StaffDashboard() {
    const { t, locale, dir } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch real data
    const user = useQuery(api.users.currentUser);
    const students = useQuery(api.users.getAllStudents);
    const registrations = useQuery(api.registrations.list);
    const stats = useQuery(api.admin.getStats);

    // Get today's date for attendance
    const today = new Date().toISOString().split('T')[0];

    // Filter students based on search
    const filteredStudents = students?.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone?.includes(searchQuery)
    ) || [];

    // Count pending registrations
    const pendingRegistrations = registrations?.filter(r => r.status === "new").length ?? 0;

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
        <RoleGuard requiredRole="staff">
            <div className="space-y-8">
                {/* Hero Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-blue-500 to-indigo-500 text-white p-8 shadow-2xl"
                >
                    {/* Background decorations */}
                    <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute right-10 bottom-10 opacity-10">
                        <Building className="h-32 w-32" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sky-100">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-sm font-medium uppercase tracking-wider">
                                    {locale === 'ar' ? 'مركز العمليات' : "Operations Center"}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold font-amiri">
                                {getGreeting()}, {user?.name?.split(' ')[0] || (locale === 'ar' ? 'موظف' : 'Staff')}!
                            </h1>
                            <p className="text-sky-100 max-w-md">
                                {locale === 'ar'
                                    ? 'مركز الدعم الإداري والعمليات اليومية للمدرسة.'
                                    : 'Administrative support and daily operations center.'
                                }
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link href="/dashboard/manager/students">
                                <Button
                                    size="lg"
                                    className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm rounded-xl"
                                >
                                    <Users className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                    {locale === 'ar' ? 'دليل الطلاب' : 'Student Directory'}
                                </Button>
                            </Link>
                            <Link href="/dashboard/manager/fees">
                                <Button
                                    size="lg"
                                    className="bg-white text-sky-600 hover:bg-sky-50 rounded-xl font-bold shadow-lg"
                                >
                                    <CreditCard className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                    {locale === 'ar' ? 'الرسوم' : 'Fees'}
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
                        <Link href="/dashboard/teacher/attendance">
                            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 hover:from-emerald-500/20 hover:to-teal-500/10 transition-all duration-300 group cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {locale === 'ar' ? 'تسجيل الحضور' : 'Daily Check-ins'}
                                            </p>
                                            <p className="text-3xl font-bold mt-1">
                                                {stats === undefined ? (
                                                    <Loader2 className="h-6 w-6 animate-spin" />
                                                ) : stats?.totalStudents ?? 0}
                                            </p>
                                        </div>
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Users className="h-6 w-6 text-emerald-500" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {locale === 'ar' ? 'طلاب مسجلين' : 'Total enrolled students'}
                                    </p>
                                    <ChevronRight className={cn(
                                        "absolute top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all",
                                        dir === 'rtl' ? "left-4 rotate-180" : "right-4"
                                    )} />
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/dashboard/manager/applications">
                            <Card className={cn(
                                "relative overflow-hidden border-0 transition-all duration-300 group cursor-pointer",
                                pendingRegistrations > 0
                                    ? "bg-gradient-to-br from-orange-500/10 to-amber-500/5 hover:from-orange-500/20 hover:to-amber-500/10"
                                    : "bg-gradient-to-br from-blue-500/10 to-indigo-500/5 hover:from-blue-500/20 hover:to-indigo-500/10"
                            )}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {locale === 'ar' ? 'التسجيلات الجديدة' : 'New Registrations'}
                                            </p>
                                            <p className="text-3xl font-bold mt-1">
                                                {registrations === undefined ? (
                                                    <Loader2 className="h-6 w-6 animate-spin" />
                                                ) : pendingRegistrations}
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform",
                                            pendingRegistrations > 0 ? "bg-orange-500/20" : "bg-blue-500/20"
                                        )}>
                                            <UserPlus className={cn(
                                                "h-6 w-6",
                                                pendingRegistrations > 0 ? "text-orange-500" : "text-blue-500"
                                            )} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {pendingRegistrations > 0
                                            ? (locale === 'ar' ? 'بانتظار المراجعة' : 'Pending verification')
                                            : (locale === 'ar' ? 'لا توجد طلبات جديدة' : 'No pending requests')
                                        }
                                    </p>
                                    {pendingRegistrations > 0 && (
                                        <span className="absolute top-3 right-3 h-3 w-3 rounded-full bg-orange-500 animate-pulse" />
                                    )}
                                    <ChevronRight className={cn(
                                        "absolute top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all",
                                        pendingRegistrations > 0 ? "text-orange-500" : "text-blue-500",
                                        dir === 'rtl' ? "left-4 rotate-180" : "right-4"
                                    )} />
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-500/10 to-purple-500/5">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {locale === 'ar' ? 'الحلقات النشطة' : 'Active Classes'}
                                        </p>
                                        <p className="text-3xl font-bold mt-1">
                                            {stats === undefined ? (
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            ) : stats?.activeClasses ?? 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                                        <Calendar className="h-6 w-6 text-violet-500" />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {locale === 'ar' ? 'حلقات قائمة' : 'Running halaqas'}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {locale === 'ar' ? 'آيات محفوظة' : 'Ayahs Memorized'}
                                        </p>
                                        <p className="text-3xl font-bold mt-1 text-amber-600">
                                            {stats === undefined ? (
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            ) : stats?.totalAyahs?.toLocaleString() ?? 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                                        <CheckCircle className="h-6 w-6 text-amber-500" />
                                    </div>
                                </div>
                                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2">
                                    <TrendingUp className="h-3 w-3" />
                                    {locale === 'ar' ? 'تقدم مبارك' : 'Blessed progress'}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Student Search */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="border-0 bg-background/50 backdrop-blur-xl shadow-xl h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                                        <Search className="h-5 w-5 text-sky-500" />
                                    </div>
                                    <div>
                                        <span className="text-lg font-bold">
                                            {locale === 'ar' ? 'البحث السريع عن طالب' : 'Quick Student Lookup'}
                                        </span>
                                        <p className="text-xs text-muted-foreground font-normal">
                                            {locale === 'ar' ? 'البحث بالاسم أو البريد أو الهاتف' : 'Search by name, email, or phone'}
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className={cn(
                                            "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                                            dir === 'rtl' ? "right-3" : "left-3"
                                        )} />
                                        <Input
                                            className={cn(
                                                "rounded-xl border-0 bg-accent/50",
                                                dir === 'rtl' ? "pr-10" : "pl-10"
                                            )}
                                            placeholder={locale === 'ar' ? "ابحث عن طالب..." : "Search student name or ID..."}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Link href="/dashboard/manager/students">
                                        <Button className="rounded-xl bg-sky-500 hover:bg-sky-600">
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>

                                {/* Search Results */}
                                <AnimatePresence>
                                    {searchQuery && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-2 max-h-[300px] overflow-y-auto"
                                        >
                                            {students === undefined ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                                </div>
                                            ) : filteredStudents.length === 0 ? (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    <Users className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                                    <p className="text-sm">{locale === 'ar' ? 'لا توجد نتائج' : 'No students found'}</p>
                                                </div>
                                            ) : (
                                                filteredStudents.slice(0, 5).map((student, idx) => (
                                                    <motion.div
                                                        key={student._id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.05 * idx }}
                                                        className="flex items-center justify-between p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors group cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                                                                {student.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{student.name}</p>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    {student.email && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Mail className="h-3 w-3" />
                                                                            {student.email}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className={cn(
                                                            "h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
                                                            dir === 'rtl' && "rotate-180"
                                                        )} />
                                                    </motion.div>
                                                ))
                                            )}
                                            {filteredStudents.length > 5 && (
                                                <Link
                                                    href="/dashboard/manager/students"
                                                    className="block text-center py-2 text-sm text-sky-500 hover:underline"
                                                >
                                                    {locale === 'ar'
                                                        ? `عرض ${filteredStudents.length - 5} نتيجة إضافية...`
                                                        : `View ${filteredStudents.length - 5} more results...`
                                                    }
                                                </Link>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card className="border-0 bg-background/50 backdrop-blur-xl shadow-xl h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <CreditCard className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <span className="text-lg font-bold">
                                            {locale === 'ar' ? 'تحصيل الرسوم' : 'Payment Collection'}
                                        </span>
                                        <p className="text-xs text-muted-foreground font-normal">
                                            {locale === 'ar' ? 'تسجيل المدفوعات النقدية' : 'Record cash payments'}
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {locale === 'ar'
                                        ? 'قم بتسجيل المدفوعات النقدية للطلاب بسرعة وسهولة.'
                                        : 'Quickly record over-the-counter cash payments from students.'
                                    }
                                </p>
                                <Link href="/dashboard/manager/fees" className="block">
                                    <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.98] group">
                                        <CreditCard className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                                        {locale === 'ar' ? 'فتح شاشة الدفع' : 'Open Cashier'}
                                        <Sparkles className="h-4 w-4 ltr:ml-2 rtl:mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                </Link>

                                <div className="pt-4 border-t border-border/50">
                                    <h4 className="text-sm font-medium mb-3">
                                        {locale === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href="/dashboard/manager/applications"
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-md",
                                                pendingRegistrations > 0
                                                    ? "bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10"
                                                    : "bg-accent/30 border-transparent hover:bg-accent/50"
                                            )}
                                        >
                                            <UserPlus className={cn(
                                                "h-6 w-6 mb-2",
                                                pendingRegistrations > 0 ? "text-orange-500" : "text-muted-foreground"
                                            )} />
                                            <span className="text-xs font-medium text-center">
                                                {locale === 'ar' ? 'التسجيلات' : 'Applications'}
                                            </span>
                                            {pendingRegistrations > 0 && (
                                                <span className="mt-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                                                    {pendingRegistrations}
                                                </span>
                                            )}
                                        </Link>
                                        <Link
                                            href="/messages"
                                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-accent/30 border border-transparent hover:bg-accent/50 transition-all hover:shadow-md"
                                        >
                                            <FileText className="h-6 w-6 text-muted-foreground mb-2" />
                                            <span className="text-xs font-medium text-center">
                                                {locale === 'ar' ? 'الرسائل' : 'Messages'}
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Recent Registrations */}
                {registrations && registrations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Card className="border-0 bg-background/50 backdrop-blur-xl shadow-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                            <UserPlus className="h-5 w-5 text-violet-500" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-bold">
                                                {locale === 'ar' ? 'التسجيلات الأخيرة' : 'Recent Registrations'}
                                            </span>
                                            <p className="text-xs text-muted-foreground font-normal">
                                                {locale === 'ar' ? 'آخر طلبات التسجيل' : 'Latest enrollment requests'}
                                            </p>
                                        </div>
                                    </CardTitle>
                                    <Link href="/dashboard/manager/applications">
                                        <Button variant="outline" size="sm" className="rounded-xl">
                                            {locale === 'ar' ? 'عرض الكل' : 'View All'}
                                            <ChevronRight className={cn("h-4 w-4 ltr:ml-1 rtl:mr-1", dir === 'rtl' && "rotate-180")} />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {registrations.slice(0, 4).map((reg, idx) => (
                                        <motion.div
                                            key={reg._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="flex items-center justify-between p-4 rounded-xl bg-accent/20 hover:bg-accent/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold",
                                                    reg.status === 'new' ? "bg-gradient-to-br from-orange-500 to-amber-500" :
                                                        reg.status === 'contacted' ? "bg-gradient-to-br from-blue-500 to-indigo-500" :
                                                            "bg-gradient-to-br from-emerald-500 to-teal-500"
                                                )}>
                                                    {reg.studentName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{reg.studentName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {reg.parentName} • {reg.plan}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                                                    reg.status === 'new' ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400" :
                                                        reg.status === 'contacted' ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                                                            "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                                )}>
                                                    {reg.status === 'new' ? (locale === 'ar' ? 'جديد' : 'New') :
                                                        reg.status === 'contacted' ? (locale === 'ar' ? 'تم التواصل' : 'Contacted') :
                                                            (locale === 'ar' ? 'مسجل' : 'Enrolled')}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(reg.submittedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </RoleGuard>
    );
}
