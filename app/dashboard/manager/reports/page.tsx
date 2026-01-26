"use client";

import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    LineChart,
    Line
} from 'recharts';
import {
    Download,
    FileText,
    Loader2,
    RefreshCw,
    TrendingUp,
    Activity,
    PieChart as PieIcon,
    ArrowUpRight,
    Search,
    Filter,
    Printer,
    Sparkles
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ExportButtons } from "@/components/Reporting/ExportButtons";

export default function ManagerReportsPage() {
    const data = useQuery(api.reports.getSummary);
    const chartData = data || [];

    const handlePrint = () => {
        window.print();
    };

    if (data === undefined) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#030712]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full border-t-2 border-emerald-500 animate-spin" />
                    <p className="text-emerald-500 font-amiri tracking-widest animate-pulse">Consulting the Astral Records...</p>
                </div>
            </div>
        );
    }

    return (
        <RoleGuard requiredRole="manager">
            <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8 space-y-10 relative overflow-hidden print:bg-white print:text-black">
                {/* Visual Atmosphere */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 print:hidden">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl font-bold font-amiri tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-100">
                            Academic Insights
                        </h1>
                        <p className="text-zinc-500 mt-2 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            Comprehensive analysis of institutional progress and vitality.
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-1 backdrop-blur-xl flex gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handlePrint}
                                className="h-10 rounded-xl hover:bg-white/10 text-white gap-2"
                            >
                                <Printer className="h-4 w-4" />
                                Print
                            </Button>
                            <ExportButtons />
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-4">
                    <ReportStatCard
                        label="Average Reach"
                        value="94.2%"
                        trend="+2.1%"
                        icon={TrendingUp}
                        color="text-emerald-400"
                    />
                    <ReportStatCard
                        label="Active Scholars"
                        value="1,280"
                        trend="+12"
                        icon={Activity}
                        color="text-blue-400"
                    />
                    <ReportStatCard
                        label="Subject Coverage"
                        value="100%"
                        trend="Stable"
                        icon={PieIcon}
                        color="text-purple-400"
                    />
                    <ReportStatCard
                        label="Fiscal Health"
                        value="$42.5k"
                        trend="+5.4%"
                        icon={ArrowUpRight}
                        color="text-amber-400"
                    />
                </div>

                {chartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-24 border border-dashed border-white/5 rounded-[3rem] bg-zinc-900/20 text-center backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                        <div className="relative z-10">
                            <div className="h-20 w-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mb-6 mx-auto border border-emerald-500/20">
                                <Sparkles className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h3 className="font-bold text-2xl text-zinc-100 font-amiri tracking-widest">Awaiting Astral Data</h3>
                            <p className="text-zinc-500 max-w-sm mt-2 mx-auto italic">Synchronize attendance and financial records to illuminate these analytics.</p>
                            <Button className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 px-8 font-bold">Initiate Sync</Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-12 print:block">
                        {/* Main Charts */}
                        <div className="lg:col-span-8 space-y-8">
                            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl">
                                <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-amiri tracking-widest text-emerald-400">Attendance Horizon</CardTitle>
                                        <p className="text-xs text-zinc-500 uppercase tracking-tighter mt-1">Monthly scholarly presence engagement</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Activity className="h-5 w-5" />
                                    </div>
                                </CardHeader>
                                <CardContent className="h-[400px] p-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.03} vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                fontSize={11}
                                                stroke="#52525b"
                                                tickLine={false}
                                                axisLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                fontSize={11}
                                                unit="%"
                                                stroke="#52525b"
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#09090b", borderColor: "rgba(255,255,255,0.05)", borderRadius: "1.5rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
                                                itemStyle={{ color: "#fff" }}
                                            />
                                            <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAttend)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl">
                                <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-amiri tracking-widest text-blue-400">Tuition Constellation</CardTitle>
                                        <p className="text-xs text-zinc-500 uppercase tracking-tighter mt-1">Institutional revenue health telemetry</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                </CardHeader>
                                <CardContent className="h-[400px] p-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.03} vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                fontSize={11}
                                                stroke="#52525b"
                                                tickLine={false}
                                                axisLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                fontSize={11}
                                                unit="$"
                                                stroke="#52525b"
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#09090b", borderColor: "rgba(255,255,255,0.05)", borderRadius: "1.5rem" }}
                                                formatter={(value) => [`$${value}`, "Revenue"]}
                                            />
                                            <Bar dataKey="payments" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={45} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Content */}
                        <div className="lg:col-span-4 space-y-8">
                            <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-6 border-b border-white/5">
                                    <CardTitle className="text-lg font-amiri tracking-widest uppercase">Archived Chronicles</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    {["Monthly Attendance Orbit", "Scholarly Progress Path", "Fiscal Alignment Q1"].map((report, i) => (
                                        <div key={i} className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-emerald-500/5 border border-white/5 cursor-pointer transition-all">
                                            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all">
                                                <FileText className="h-6 w-6 text-zinc-500 group-hover:text-emerald-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">{report}</p>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">PDF • Jan 2026</p>
                                            </div>
                                            <Download className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    ))}
                                    <Button variant="ghost" className="w-full text-xs text-zinc-500 hover:text-white mt-4 gap-2">
                                        <RefreshCw className="h-3 w-3" />
                                        Update Archives
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-white/10 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-30">
                                    <Sparkles className="h-12 w-12 text-indigo-400" />
                                </div>
                                <CardContent className="p-8 space-y-6">
                                    <h3 className="text-xl font-bold font-amiri tracking-widest leading-tight">Empower Academic Decisions</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed">Cross-analyze subject performance with attendance metrics to optimize educational pathways.</p>
                                    <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold h-12">
                                        Deep Analysis
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}

function ReportStatCard({ label, value, trend, icon: Icon, color }: any) {
    return (
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-3xl overflow-hidden group hover:border-white/10 transition-all border">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/10`}>
                        {trend}
                    </span>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</p>
                    <p className="text-3xl font-bold tracking-tighter text-white">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
