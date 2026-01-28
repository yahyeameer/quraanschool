"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Library,
    Users,
    Clock,
    Search,
    Plus,
    ArrowRight,
    Bookmark
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

// Mock Data
const libraryStats = [
    { title: "Total Books", value: "1,240", icon: Library, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Active Loans", value: "85", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Overdue Books", value: "12", icon: Clock, color: "text-rose-400", bg: "bg-rose-500/10" },
    { title: "Reserved", value: "24", icon: Bookmark, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const categoryData = [
    { name: "Quranic", count: 450, color: "#fbbf24" },
    { name: "Hadith", count: 300, color: "#34d399" },
    { name: "Fiqh", count: 200, color: "#60a5fa" },
    { name: "History", count: 180, color: "#a78bfa" },
    { name: "Children", count: 110, color: "#f472b6" },
];

const recentLoans = [
    { id: 1, book: "Sahih Al-Bukhari Vol 1", student: "Omar Farooq", class: "Hifz A", due: "2024-03-15" },
    { id: 2, book: "Stories of the Prophets", student: "Ayesha Khan", class: "Nazra B", due: "2024-03-12" },
    { id: 3, book: "Tajweed Rules", student: "Bilal Ahmed", class: "Hifz B", due: "2024-03-10" },
];

export default function LibrarianDashboard() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-8 font-sans text-slate-100 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[5%] left-[50%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[5%] left-[5%] w-[30%] h-[30%] bg-amber-600/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                className="relative z-10 max-w-7xl mx-auto space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                            Library Manager
                        </h1>
                        <p className="text-slate-400 mt-1">Manage catalog, track loans, and reserve books.</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Quick lookup ISBN/Title..."
                                className="bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 w-64 transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Check Out
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {libraryStats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-blue-500/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h4>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Categories Chart & Recent Loans */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Categories Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-slate-200">Book Categories</h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Quick Actions / Recent Loans */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col"
                    >
                        <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Book Loans</h3>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {recentLoans.map((loan) => (
                                <div key={loan.id} className="p-3 bg-slate-900/30 border border-white/5 rounded-xl hover:border-white/10 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-semibold text-slate-200 text-sm group-hover:text-blue-400 transition-colors">{loan.book}</div>
                                        <div className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Active</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                        <Users className="w-3 h-3" /> {loan.student} • {loan.class}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 pt-2 border-t border-white/5">
                                        <Clock className="w-3 h-3" /> Due: {loan.due}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center gap-1 transition-colors border-t border-white/5 pt-4">
                            View All Loans <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
