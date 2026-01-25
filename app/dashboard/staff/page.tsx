"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
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
    Loader2,
    Sparkles,
    ChevronRight,
    Mail,
    Building,
    TrendingUp,
    AlertCircle,
    Activity,
    ClipboardList
} from "lucide-react";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

export default function StaffDashboard() {
    const { t, locale, dir } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch real data
    const user = useQuery(api.users.currentUser);
    const students = useQuery(api.users.getAllStudents);
    const registrations = useQuery(api.registrations.list);
    const stats = useQuery(api.admin.getStats);

    // Filter students based on search
    const filteredStudents = students?.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone?.includes(searchQuery)
    ) || [];

    // Count pending registrations
    const pendingRegistrations = registrations?.filter(r => r.status === "new").length ?? 0;

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
        <RoleGuard requiredRole="staff">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6 pb-20"
            >
                {/* Operations Header */}
                <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                            <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">Operations Center</span>
                        </div>
                        <h1 className="text-4xl font-bold font-amiri tracking-tight text-foreground">
                            {getGreeting()}, {user?.name?.split(' ')[0] || (locale === 'ar' ? 'موظف' : 'Staff')}
                        </h1>
                    </div>
                </motion.div>

                {/* Hero / Main Action Center */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div variants={item} className="lg:col-span-2 rounded-[32px] bg-gradient-to-br from-sky-600 to-blue-700 p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Registration Hub</h2>
                                    <p className="text-sky-100 max-w-md">Manage new enrollments and student onboarding efficiency.</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                                    <UserPlus className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <Link href="/dashboard/manager/applications" className="flex-1">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/20 transition-colors group cursor-pointer">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-sky-100">Direct Enrollments</span>
                                            <ChevronRight className="h-4 w-4 text-sky-200 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <div className="text-2xl font-bold">{pendingRegistrations}</div>
                                        <div className="text-xs text-sky-200 mt-1">Pending Review</div>
                                    </div>
                                </Link>
                                <Link href="/dashboard/manager/students" className="flex-1">
                                    <div className="bg-white text-sky-700 rounded-2xl p-4 hover:bg-sky-50 transition-colors group cursor-pointer shadow-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-bold">Student Directory</span>
                                            <Search className="h-4 w-4 opacity-50" />
                                        </div>
                                        <div className="text-2xl font-bold">{stats?.totalStudents ?? 0}</div>
                                        <div className="text-xs opacity-70 mt-1">Total Active Students</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="glass-card rounded-[32px] p-6 flex flex-col justify-between group hover:bg-emerald-500/5 transition-colors">
                        <div>
                            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 text-xl font-bold">
                                $
                            </div>
                            <h3 className="text-xl font-bold mb-1">Fee Collection</h3>
                            <p className="text-sm text-muted-foreground">Process cash payments and view transactions.</p>
                        </div>
                        <Link href="/dashboard/manager/fees">
                            <button className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-6">
                                <CreditCard className="h-4 w-4" />
                                Open Terminal
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Operations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StaffBentoCard title="Daily Attendance" value={stats?.activeClasses ?? 0} icon={Calendar} sub="Classes Today" color="bg-violet-500" />
                    <StaffBentoCard title="Messages" value="12" icon={Mail} sub="Unread" color="bg-pink-500" />
                    <StaffBentoCard title="Maintenance" value="All Good" icon={CheckCircle} sub="System Status" color="bg-emerald-500" />
                    <StaffBentoCard title="Reports" value="Generate" icon={FileText} sub="Weekly Summary" color="bg-amber-500" />
                </div>

                {/* Search & List Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Search Module */}
                    <motion.div variants={item} className="lg:col-span-2 glass-card rounded-[32px] p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-accent rounded-lg">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="font-bold text-lg">Quick Lookup</h3>
                        </div>

                        <div className="relative mb-6">
                            <Input
                                className={cn(
                                    "h-12 rounded-xl bg-accent/30 border-transparent focus:bg-background transition-all pl-10 text-base",
                                    dir === 'rtl' ? "pr-10" : "pl-10"
                                )}
                                placeholder={locale === 'ar' ? "ابحث عن طالب..." : "Search student name or ID..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                        </div>

                        <div className="space-y-2">
                            {students === undefined ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : filteredStudents.length === 0 && searchQuery ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No students found matching "{searchQuery}"</p>
                                </div>
                            ) : (
                                (searchQuery ? filteredStudents : filteredStudents.slice(0, 5)).map((student, idx) => (
                                    <motion.div
                                        key={student._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * idx }}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-colors group cursor-pointer border border-transparent hover:border-border/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-foreground">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">{student.email || 'No email'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-background rounded-lg text-xs font-bold border border-border">View</button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div variants={item} className="glass-card rounded-[32px] p-6">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-orange-500" />
                            Recent
                        </h3>
                        <div className="space-y-6">
                            {registrations?.slice(0, 3).map((reg, i) => (
                                <div key={i} className="flex gap-3 relative">
                                    {i !== 2 && <div className="absolute left-[19px] top-10 bottom-[-10px] w-0.5 bg-border/50" />}
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-accent flex items-center justify-center border-4 border-background z-10">
                                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">New Registration</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{reg.studentName}</p>
                                        <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(reg.submittedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </RoleGuard>
    );
}

function StaffBentoCard({ title, value, icon: Icon, sub, color }: any) {
    return (
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }} className="glass-card p-5 rounded-[24px] hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-3">
                <div className={cn("p-2 rounded-xl text-white", color)}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="text-2xl font-bold font-amiri text-foreground group-hover:scale-105 transition-transform origin-left">{value}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mt-1">{title}</div>
            <div className="text-[10px] text-muted-foreground/50 mt-1">{sub}</div>
        </motion.div>
    );
}
