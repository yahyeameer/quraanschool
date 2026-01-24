"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DollarSign,
    Wallet,
    TrendingUp,
    TrendingDown,
    CreditCard,
    FileText,
    PieChart,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Sparkles
} from "lucide-react";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

export default function AccountantDashboard() {
    const { t, locale } = useLanguage();
    const user = useQuery(api.users.currentUser);
    const overview = useQuery(api.finance.getFinancialOverview);
    const stats = useQuery(api.admin.getStats); // For student count context

    // Calculate profit margin
    const profitMargin = overview
        ? ((overview.netIncome / overview.totalRevenue) * 100).toFixed(1)
        : "0";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <RoleGuard requiredRole="accountant">
            <div className="space-y-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-600 to-teal-600 text-white p-8 shadow-2xl"
                >
                    <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-100">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-sm font-medium uppercase tracking-wider">
                                    Financial Command Center
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold font-amiri">
                                {getGreeting()}, {user?.name?.split(' ')[0] || 'Accountant'}
                            </h1>
                            <p className="text-emerald-100 max-w-md">
                                Overview of school finances for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link href="/dashboard/manager/fees">
                                <Button className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold shadow-lg">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Collect Fees
                                </Button>
                            </Link>
                            <Link href="/dashboard/manager/finance/expenses">
                                <Button className="bg-emerald-700/50 hover:bg-emerald-700 text-white border border-emerald-400/30 rounded-xl backdrop-blur-sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Record Expense
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Financial Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 relative overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-bold">
                                        {overview ? `$${overview.totalRevenue.toLocaleString()}` : <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                        <ArrowUpRight className="h-3 w-3" />
                                        <span>Income from fees & donations</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-0 bg-gradient-to-br from-red-500/10 to-orange-500/5 relative overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
                                    <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                        <TrendingDown className="h-5 w-5 text-red-600" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-bold text-red-700">
                                        {overview ? `$${overview.totalExpenses.toLocaleString()}` : <Loader2 className="h-8 w-8 animate-spin text-red-500" />}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                                        <ArrowDownRight className="h-3 w-3" />
                                        <span>Salaries & Operational costs</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 relative overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-muted-foreground">Net Income</span>
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <Wallet className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-bold text-blue-700">
                                        {overview ? `$${overview.netIncome.toLocaleString()}` : <Loader2 className="h-8 w-8 animate-spin text-blue-500" />}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                                        <PieChart className="h-3 w-3" />
                                        <span>{profitMargin}% Profit Margin</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Quick Links / Tasks */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Link href="/dashboard/manager/fees" className="flex items-center justify-between p-4 rounded-xl border hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Student Fee Management</p>
                                        <p className="text-xs text-muted-foreground">Track pending payments and process fees</p>
                                    </div>
                                </div>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </Link>

                            <Link href="/dashboard/manager/salaries" className="flex items-center justify-between p-4 rounded-xl border hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                        <Wallet className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Staff Payroll</p>
                                        <p className="text-xs text-muted-foreground">Manage monthly salary disbursements</p>
                                    </div>
                                </div>
                                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Pending Actions (Mock for now or derive from deep queries if possible) */}
                    <Card className="bg-amber-500/5 border-amber-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-700">
                                <AlertCircle className="h-5 w-5" />
                                Attention Required
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Pending Approvals</span>
                                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-bold">3 Expenses</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Unpaid Fees (Current Month)</span>
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">12 Students</span>
                                </div>
                                <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white" size="sm">
                                    View Action Items
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RoleGuard>
    );
}
