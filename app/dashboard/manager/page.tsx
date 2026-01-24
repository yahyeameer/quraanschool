"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { StatCard } from "@/components/Dashboard/Shared/StatCard";
import { PerformanceChart } from "@/components/Dashboard/Shared/PerformanceChart";
import {
    Users,
    GraduationCap,
    CheckCircle,
    AlertCircle,
    BookOpen,
    Sparkles,
    Activity,
    ArrowUpRight,
    Search,
    Bell,
    Settings,
    Shield
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ManagerDashboard() {
    const stats = useQuery(api.admin.getStats);
    const registrations = useQuery(api.registrations.list);
    const pendingCount = registrations?.filter(r => r.status === "new").length ?? 0;

    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-8 p-4 md:p-8 min-h-screen">
                {/* Header Section with Glass Effect */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Shield className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-amiri tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                Manager Command
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                System Operational
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95">
                            <Search className="h-5 w-5 text-white/70" />
                        </button>
                        <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 relative">
                            <Bell className="h-5 w-5 text-white/70" />
                            {pendingCount > 0 && (
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-black" />
                            )}
                        </button>
                        <Link href="/dashboard/manager/settings">
                            <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95">
                                <Settings className="h-5 w-5 text-white/70" />
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid - Liquid Glass Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <LiquidStatCard
                        title="Total Students"
                        value={stats?.totalStudents?.toString() ?? "0"}
                        icon={Users}
                        trend="+12%"
                        color="blue"
                        delay={0.1}
                    />
                    <LiquidStatCard
                        title="Active Classes"
                        value={stats?.activeClasses?.toString() ?? "0"}
                        icon={BookOpen}
                        trend="Stable"
                        color="violet"
                        delay={0.2}
                    />
                    <LiquidStatCard
                        title="Memorization"
                        value={stats?.totalAyahs?.toLocaleString() ?? "0"}
                        subtitle="Ayahs"
                        icon={CheckCircle}
                        trend="+5%"
                        color="emerald"
                        delay={0.3}
                    />
                    <LiquidStatCard
                        title="Pending Apps"
                        value={pendingCount.toString()}
                        icon={AlertCircle}
                        trend={pendingCount > 0 ? "Action Needed" : "Clear"}
                        color={pendingCount > 0 ? "orange" : "zinc"}
                        delay={0.4}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-12">
                    {/* Performance Chart Section */}
                    <div className="md:col-span-8 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-6 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-emerald-400" />
                                    Academic Velocity
                                </h3>
                                <div className="flex gap-2">
                                    {['W', 'M', 'Y'].map(p => (
                                        <button key={p} className="h-8 w-8 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <PerformanceChart />
                            </div>
                        </motion.div>

                        {/* Control Center Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <ControlWidget
                                title="System Health"
                                status="Optimal"
                                statusColor="bg-emerald-500"
                                description="All services running"
                                delay={0.6}
                            />
                            <ControlWidget
                                title="Data Backup"
                                status="Secure"
                                statusColor="bg-blue-500"
                                description="Last snapshot: 2h ago"
                                delay={0.7}
                            />
                        </div>
                    </div>

                    {/* Quick Actions Dock */}
                    <div className="md:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="h-full p-6 rounded-[32px] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col"
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-400" />
                                Quick Actions
                            </h3>

                            <div className="space-y-3 flex-1">
                                <ActionRow href="/dashboard/manager/staff" icon={Users} color="blue" title="Manage Staff" subtitle="Teachers & Ops" />
                                <ActionRow href="/dashboard/manager/students" icon={GraduationCap} color="emerald" title="Student Directory" subtitle="Profiles & Enrollments" />
                                <ActionRow href="/dashboard/manager/applications" icon={AlertCircle} color="orange" title="Applications" subtitle={`${pendingCount} Pending Reviews`} />
                                <ActionRow href="/dashboard/manager/reports" icon={BookOpen} color="violet" title="Academic Reports" subtitle="Generate PDFs" />
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                    <h4 className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Storage</h4>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                                        <div className="h-full w-[45%] bg-gradient-to-r from-emerald-500 to-cyan-500" />
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>45GB used</span>
                                        <span>100GB total</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}

// Helper Components for that "Liquid Glass" feel

function LiquidStatCard({ title, value, subtitle, icon: Icon, trend, color, delay }: any) {
    const gradients: Record<string, string> = {
        blue: "from-blue-500/20 to-cyan-500/20",
        violet: "from-violet-500/20 to-fuchsia-500/20",
        emerald: "from-emerald-500/20 to-teal-500/20",
        orange: "from-amber-500/20 to-orange-500/20",
        zinc: "from-zinc-500/20 to-zinc-600/20"
    };

    const textColors: Record<string, string> = {
        blue: "text-cyan-400",
        violet: "text-fuchsia-400",
        emerald: "text-emerald-400",
        orange: "text-amber-400",
        zinc: "text-zinc-400"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={cn(
                "relative overflow-hidden p-6 rounded-[28px] border border-white/10 backdrop-blur-xl bg-gradient-to-br transition-all hover:scale-[1.02] hover:shadow-2xl group",
                gradients[color] || gradients.zinc
            )}
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-3 rounded-2xl bg-black/20 backdrop-blur-md", textColors[color])}>
                        <Icon className="h-6 w-6" />
                    </div>
                    {trend && (
                        <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> {trend}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-4xl font-bold font-amiri tracking-tight text-white mb-1">{value}</h3>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                        {title} {subtitle && <span className="opacity-60 font-normal">({subtitle})</span>}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

function ActionRow({ href, icon: Icon, color, title, subtitle }: any) {
    const textColors: Record<string, string> = {
        blue: "text-blue-400",
        emerald: "text-emerald-400",
        orange: "text-orange-400",
        violet: "text-violet-400"
    };

    return (
        <Link href={href} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg transition-all group">
            <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center bg-black/20 group-hover:scale-110 transition-transform",
                textColors[color]
            )}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-base group-hover:text-white transition-colors">{title}</h4>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                <ArrowUpRight className="h-4 w-4 text-white/50" />
            </div>
        </Link>
    );
}

function ControlWidget({ title, status, statusColor, description, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="p-5 rounded-[24px] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
        >
            <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-white/80">{title}</span>
                <span className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_10px_currentColor]", statusColor)} />
            </div>
            <p className="text-2xl font-bold tracking-tight mb-1">{status}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{description}</p>
        </motion.div>
    );
}
