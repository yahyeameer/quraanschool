"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Wallet,
    PieChart as PieChartIcon,
    Activity
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

// Mock Data
const revenueData = [
    { name: "Jan", revenue: 4000, expenses: 2400 },
    { name: "Feb", revenue: 3000, expenses: 1398 },
    { name: "Mar", revenue: 2000, expenses: 9800 },
    { name: "Apr", revenue: 2780, expenses: 3908 },
    { name: "May", revenue: 1890, expenses: 4800 },
    { name: "Jun", revenue: 2390, expenses: 3800 },
    { name: "Jul", revenue: 3490, expenses: 4300 },
];

const feeStatusData = [
    { name: "Paid", value: 400, color: "#4ade80" }, // Green
    { name: "Pending", value: 300, color: "#fbbf24" }, // Amber
    { name: "Overdue", value: 100, color: "#f87171" }, // Red
];

const recentTransactions = [
    { id: 1, user: "Ahmed Ali", type: "Fee Payment", amount: "+$150.00", date: "2024-03-10", status: "Completed" },
    { id: 2, user: "Utility Bill", type: "Expense", amount: "-$450.00", date: "2024-03-09", status: "Processed" },
    { id: 3, user: "Sarah Smith", type: "Fee Payment", amount: "+$150.00", date: "2024-03-09", status: "Completed" },
    { id: 4, user: "Maintenance", type: "Expense", amount: "-$120.00", date: "2024-03-08", status: "Processed" },
];

export default function AccountantDashboard() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-8 font-sans text-foreground overflow-hidden relative transition-colors duration-500">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 dark:bg-amber-600/10 rounded-full blur-[120px]" />
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
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Financial Overview
                        </h1>
                        <p className="text-muted-foreground mt-1">Welcome back, analyze the school's financial health.</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-foreground dark:text-slate-300 transition-all backdrop-blur-md">
                            Download Report
                        </button>
                        <button className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 dark:border-amber-500/50 text-amber-600 dark:text-amber-400 rounded-lg text-sm transition-all shadow-sm backdrop-blur-md">
                            + New Transaction
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Revenue"
                        value="$45,231.89"
                        change="+20.1% from last month"
                        icon={DollarSign}
                        color="text-emerald-500 dark:text-emerald-400"
                        trend="up"
                    />
                    <StatsCard
                        title="Expenses"
                        value="$12,345.00"
                        change="+4.5% from last month"
                        icon={CreditCard}
                        color="text-rose-500 dark:text-rose-400"
                        trend="down"
                    />
                    <StatsCard
                        title="Net Income"
                        value="$32,886.89"
                        change="+12.5% from last month"
                        icon={Wallet}
                        color="text-amber-500 dark:text-amber-400"
                        trend="up"
                    />
                    <StatsCard
                        title="Outstanding Properties"
                        value="$4,200.00"
                        change="-2.3% from last month"
                        icon={Activity}
                        color="text-blue-500 dark:text-blue-400"
                        trend="down"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Revenue Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-foreground dark:text-slate-200 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                                Revenue vs Expenses
                            </h3>
                            <select className="bg-transparent dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1 text-xs text-muted-foreground outline-none focus:border-amber-500/50">
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Fee Status Pie Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col shadow-sm dark:shadow-none"
                    >
                        <h3 className="text-lg font-semibold text-foreground dark:text-slate-200 mb-4 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                            Fee Collection
                        </h3>

                        <div className="flex-1 flex items-center justify-center relative">
                            <div className="h-[220px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={feeStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {feeStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-foreground dark:text-white">75%</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Collected</span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            {feeStatusData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-muted-foreground dark:text-slate-300">{item.name}</span>
                                    </div>
                                    <span className="font-semibold text-foreground dark:text-slate-200">{item.value} Students</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Transactions */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-foreground dark:text-slate-200">Recent Transactions</h3>
                        <button className="text-sm text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                                    <th className="pb-4 pl-2 font-medium">Transaction ID</th>
                                    <th className="pb-4 font-medium">User/Entity</th>
                                    <th className="pb-4 font-medium">Type</th>
                                    <th className="pb-4 font-medium">Date</th>
                                    <th className="pb-4 font-medium text-right">Amount</th>
                                    <th className="pb-4 pr-2 font-medium text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentTransactions.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-2 text-muted-foreground border-b border-border font-mono">#{tx.id + 2030}</td>
                                        <td className="py-4 text-foreground dark:text-slate-200 border-b border-border font-medium">{tx.user}</td>
                                        <td className="py-4 text-slate-600 dark:text-slate-300 border-b border-border">{tx.type}</td>
                                        <td className="py-4 text-muted-foreground border-b border-border">{tx.date}</td>
                                        <td className={`py-4 text-right border-b border-border font-semibold ${tx.amount.startsWith('+') ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {tx.amount}
                                        </td>
                                        <td className="py-4 pr-2 text-right border-b border-border">
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

// Sub-component for Stats Card
function StatsCard({ title, value, change, icon: Icon, color, trend }: { title: string, value: string, change: string, icon: any, color: string, trend: 'up' | 'down' }) {
    return (
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition-all group shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg bg-slate-100 dark:bg-white/5 group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-colors ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend === 'up' ? (
                    <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                        <TrendingUp className="w-3 h-3 mr-1" /> {change.split(' ')[0]}
                    </span>
                ) : (
                    <span className="flex items-center text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full border border-rose-500/20">
                        <TrendingDown className="w-3 h-3 mr-1" /> {change.split(' ')[0]}
                    </span>
                )}
            </div>
            <div>
                <h4 className="text-muted-foreground text-sm font-medium mb-1">{title}</h4>
                <div className="text-2xl font-bold text-foreground dark:text-slate-100">{value}</div>
            </div>
        </div>
    )
}
