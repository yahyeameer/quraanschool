"use client";

import { StatCard } from "@/components/Dashboard/Shared/StatCard";
import { PerformanceChart } from "@/components/Dashboard/Shared/PerformanceChart";
import { Users, GraduationCap, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ManagerDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Manager Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Students"
                    value="1,234"
                    icon={Users}
                    trend="up"
                    trendValue="+12%"
                    description="from last month"
                />
                <StatCard
                    title="Active Teachers"
                    value="42"
                    icon={GraduationCap}
                    trend="neutral"
                    trendValue="0"
                />
                <StatCard
                    title="Total Attendance"
                    value="95.2%"
                    icon={CheckCircle}
                    trend="up"
                    trendValue="+2.1%"
                    description="vs average"
                />
                <StatCard
                    title="Pending Requests"
                    value="7"
                    icon={AlertCircle}
                    className="border-orange-200 bg-orange-50 dark:bg-orange-950/20"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 space-y-6">
                    <PerformanceChart />

                    {/* Management Control Center */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            Management Control
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Manage your staff and oversee classroom activities directly.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-accent/20 border hover:bg-accent/30 transition cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">System Health</span>
                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Optimal</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">All services are running smoothly across the platform.</p>
                            </div>

                            <div className="p-4 rounded-lg bg-accent/20 border hover:bg-accent/30 transition cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Recent Backups</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Secure</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">Database backup completed successfully 2 hours ago.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity / Attendance List */}
                <div className="col-span-3 space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 h-full">
                        <h3 className="font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href="/dashboard/manager/staff" className="w-full text-left px-4 py-3 rounded-lg border hover:bg-muted transition text-sm flex items-center gap-3">
                                <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">+</span>
                                <div>
                                    <span className="block font-medium">Manage Staff</span>
                                    <span className="text-xs text-muted-foreground">View teachers and assistants</span>
                                </div>
                            </Link>
                            <Link href="/dashboard/manager/students" className="w-full text-left px-4 py-3 rounded-lg border hover:bg-muted transition text-sm flex items-center gap-3">
                                <span className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">+</span>
                                <div>
                                    <span className="block font-medium">Student Directory</span>
                                    <span className="text-xs text-muted-foreground">Enroll and view students</span>
                                </div>
                            </Link>
                            <Link href="/dashboard/manager/reports" className="w-full text-left px-4 py-3 rounded-lg border hover:bg-muted transition text-sm flex items-center gap-3">
                                <span className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">↓</span>
                                <div>
                                    <span className="block font-medium">Academic Reports</span>
                                    <span className="text-xs text-muted-foreground">Performance analytics</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
