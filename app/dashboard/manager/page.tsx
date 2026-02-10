"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { PerformanceChart } from "@/components/Dashboard/Shared/PerformanceChart";
import { TiltCard } from "@/components/ui/tilt-card";
import {
    Users,
    GraduationCap,
    CheckCircle,
    AlertCircle,
    BookOpen,
    Activity,
    ArrowUpRight,
    Settings,
    Shield,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ManagerDashboard() {
    const stats = useQuery(api.admin.getStats);
    const registrations = useQuery(api.registrations.list);
    const pendingCount = registrations?.filter(r => r.status === "new").length ?? 0;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <RoleGuard requiredRole="manager">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6 pb-20"
            >
                {/* Executive Header */}
                <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-amiri tracking-tight text-foreground drop-shadow-sm dark:text-white dark:drop-shadow-md">
                            Executive Overview
                        </h1>
                        <p className="text-muted-foreground mt-2 flex items-center gap-2 font-medium dark:text-white/70">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            System Operational • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* <div className="flex gap-2">
                        <button className="glass-pill px-5 py-2.5 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-2 text-foreground dark:text-white border border-border dark:border-white/10 bg-background/50 dark:bg-white/5 backdrop-blur-md">
                            <Activity className="h-4 w-4" />
                            Live Reports
                        </button>
                        <button className="glass-pill px-5 py-2.5 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-2 text-foreground dark:text-white border border-border dark:border-white/10 bg-background/50 dark:bg-white/5 backdrop-blur-md">
                            <Settings className="h-4 w-4" />
                            Configure
                        </button>
                    </div> */}
                    <div />
                </motion.div>

                {/* KPI Bento Grid with Tilt Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardMetric
                        title="Total Students"
                        value={stats?.totalStudents?.toString() ?? "0"}
                        icon={Users}
                        trend="+12%"
                        trendUp={true}
                        color="text-blue-600 dark:text-blue-400"
                        bg="bg-blue-500/10"
                        border="border-blue-500/20"
                    />
                    <DashboardMetric
                        title="Active Classes"
                        value={stats?.activeClasses?.toString() ?? "0"}
                        icon={BookOpen}
                        trend="Stable"
                        trendUp={true}
                        color="text-violet-600 dark:text-violet-400"
                        bg="bg-violet-500/10"
                        border="border-violet-500/20"
                    />
                    <DashboardMetric
                        title="Total Ayahs"
                        value={stats?.totalAyahs?.toLocaleString() ?? "0"}
                        icon={CheckCircle}
                        trend="+5.2%"
                        trendUp={true}
                        color="text-emerald-600 dark:text-emerald-400"
                        bg="bg-emerald-500/10"
                        border="border-emerald-500/20"
                    />
                    <DashboardMetric
                        title="Revenue (Est.)"
                        value="$12.4k"
                        icon={TrendingUp}
                        trend="+8%"
                        trendUp={true}
                        color="text-amber-600 dark:text-amber-400"
                        bg="bg-amber-500/10"
                        border="border-amber-500/20"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Charts Section */}
                    <motion.div variants={item} className="lg:col-span-8">
                        <div className="glass-card rounded-[32px] p-8 relative overflow-hidden min-h-[450px] border border-border dark:border-white/10 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground dark:text-white flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                        Academic Performance
                                    </h3>
                                    <p className="text-sm text-muted-foreground dark:text-white/50">Average score trends over time</p>
                                </div>
                                <select className="bg-background/50 dark:bg-white/5 text-sm font-bold border border-border dark:border-white/10 outline-none cursor-pointer text-foreground dark:text-white px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
                                    <option className="dark:bg-slate-900">This Week</option>
                                    <option className="dark:bg-slate-900">This Month</option>
                                    <option className="dark:bg-slate-900">This Quarter</option>
                                </select>
                            </div>
                            <div className="h-[340px] w-full relative z-10">
                                <PerformanceChart />
                            </div>

                            {/* Ambient Glows */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                        </div>
                    </motion.div>

                    {/* Quick Applications & Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Pending Applications Widget */}
                        <motion.div variants={item}>
                            <TiltCard className="glass-card rounded-[32px] p-8 relative overflow-hidden group border border-border dark:border-white/10 bg-white/40 dark:bg-slate-900/60 h-full">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                    <AlertCircle className="h-40 w-40 -rotate-12 transform translate-x-10 -translate-y-10" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-foreground dark:text-white">Applications</h3>
                                        <span className={cn(
                                            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                            pendingCount > 0
                                                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        )}>
                                            <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", pendingCount > 0 ? "bg-orange-500" : "bg-emerald-500")} />
                                            {pendingCount > 0 ? "Action Required" : "All Clear"}
                                        </span>
                                    </div>

                                    <div className="text-6xl font-bold font-amiri mb-2 text-foreground dark:text-white">{pendingCount}</div>
                                    <p className="text-sm text-muted-foreground dark:text-white/60 mb-8">Pending approvals waiting review</p>

                                    <Link href="/dashboard/manager/applications">
                                        <button className="w-full py-4 rounded-xl bg-foreground text-background dark:bg-white dark:text-slate-900 font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                            Review Applications <ArrowUpRight className="h-4 w-4" />
                                        </button>
                                    </Link>
                                </div>
                            </TiltCard>
                        </motion.div>

                        {/* Quick Actions List */}
                        <motion.div variants={item} className="glass-card rounded-[32px] p-6 border border-border dark:border-white/10 bg-white/40 dark:bg-slate-900/60">
                            <h3 className="text-xs font-bold text-muted-foreground dark:text-white/40 uppercase tracking-widest mb-6 ml-2">Quick Navigation</h3>
                            <div className="space-y-3">
                                <QuickActionItem href="/dashboard/manager/staff" icon={Users} label="Manage Staff" color="text-blue-600 dark:text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
                                <QuickActionItem href="/dashboard/manager/students" icon={GraduationCap} label="Student Directory" color="text-violet-600 dark:text-violet-400" bg="bg-violet-500/10" border="border-violet-500/20" />
                                <QuickActionItem href="/dashboard/manager/fees" icon={Shield} label="Fee Management" color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
                                <QuickActionItem href="/dashboard/manager/reports" icon={BookOpen} label="Academic Reports" color="text-amber-600 dark:text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </RoleGuard>
    );
}

// Ultra-Premium Dashboard Metric with Tilt
function DashboardMetric({ title, value, icon: Icon, trend, trendUp, color, bg, border }: any) {
    return (
        <TiltCard tiltIntensity={10} className="h-full">
            <div className={cn(
                "glass-card p-6 rounded-[24px] relative overflow-hidden group h-full border bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-colors hover:bg-white/60 dark:hover:bg-slate-900/60 border-border dark:border-white/10",
                border
            )}>
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-3 rounded-xl shadow-lg border border-border dark:border-white/5", bg, color)}>
                        <Icon className="h-5 w-5" />
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border bg-opacity-50",
                            trendUp
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                        )}>
                            {trend}
                            <ArrowUpRight className={cn("h-3 w-3", !trendUp && "rotate-180")} />
                        </div>
                    )}
                </div>

                <div className="relative z-10">
                    <h3 className="text-3xl font-bold font-amiri tracking-tight mb-1 text-foreground dark:text-white group-hover:scale-105 transition-transform origin-left drop-shadow-sm">
                        {value}
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground dark:text-white/50 font-sans tracking-wide uppercase">{title}</p>
                </div>

                {/* Hover Glow */}
                <div className={cn(
                    "absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
                    bg.replace('bg-', 'bg-') // Uses same color family
                )} />
            </div>
        </TiltCard>
    );
}

function QuickActionItem({ href, icon: Icon, label, color, bg, border }: any) {
    return (
        <Link href={href}>
            <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-border dark:hover:border-white/5 active:scale-[0.98]">
                <div className={cn("p-2.5 rounded-xl border group-hover:scale-110 transition-transform shadow-sm", bg, border, color)}>
                    <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm flex-1 text-foreground/80 dark:text-white/80 group-hover:text-foreground dark:group-hover:text-white transition-colors">{label}</span>
                <div className="h-8 w-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight className="h-4 w-4 text-foreground dark:text-white" />
                </div>
            </div>
        </Link>
    );
}
