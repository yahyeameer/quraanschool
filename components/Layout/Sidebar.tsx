"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Settings,
    Users,
    Calendar,
    LogOut,
    DollarSign,
    Wallet,
    FileText,
    MessageSquare,
    Activity,
    Bus,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";
import { LanguageSwitcher } from "@/components/Layout/LanguageSwitcher";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar({ isOpen }: { isOpen: boolean }) {
    const pathname = usePathname();
    const user = useQuery(api.users.currentUser);
    const unreadCount = useQuery(api.messages.getUnreadCount);
    const { t, locale } = useLanguage();

    // Filter routes or show specific sets
    const getRoutes = () => {
        if (!user) return [];

        if (user.role === "admin" || user.role === "manager") {
            const adminBase = [
                { label: t.sidebar.adminConsole, icon: LayoutDashboard, href: "/admin", color: "text-red-500" },
                { label: t.sidebar.managerHome, icon: LayoutDashboard, href: "/dashboard/manager", color: "text-emerald-500" },
                { label: t.sidebar.applications, icon: BookOpen, href: "/dashboard/manager/applications", color: "text-amber-600" },
                { label: t.sidebar.staff, icon: GraduationCap, href: "/dashboard/manager/staff", color: "text-sky-500" },
                { label: t.sidebar.students, icon: Users, href: "/dashboard/manager/students", color: "text-indigo-500" },
                { label: t.sidebar.fees, icon: DollarSign, href: "/dashboard/manager/fees", color: "text-emerald-600" },
                { label: "Expenses", icon: Wallet, href: "/dashboard/manager/finance/expenses", color: "text-red-500" },
                { label: t.sidebar.salaries, icon: Wallet, href: "/dashboard/manager/salaries", color: "text-blue-600" },
                { label: "Transport", icon: Bus, href: "/dashboard/manager/transport", color: "text-amber-500" },
                { label: t.sidebar.academic, icon: GraduationCap, href: "/dashboard/manager/academic", color: "text-orange-500" },
                { label: t.sidebar.analytics || "Analytics", icon: Activity, href: "/dashboard/manager/analytics", color: "text-indigo-600" },
                { label: t.sidebar.reports, icon: BookOpen, href: "/dashboard/manager/reports", color: "text-amber-500" },
                { label: t.sidebar.settings, icon: Settings, href: "/dashboard/manager/settings", color: "text-zinc-500" },
                { label: t.sidebar.messages || "Messages", icon: MessageSquare, href: "/messages", color: "text-blue-500", badge: unreadCount || 0 },
            ];
            return adminBase;
        }

        if (user.role === "teacher") {
            return [
                { label: t.sidebar.classOverview, icon: LayoutDashboard, href: "/dashboard/teacher", color: "text-sky-500" },
                { label: t.sidebar.attendance, icon: Calendar, href: "/dashboard/teacher/attendance", color: "text-purple-500" },
                { label: t.sidebar.schedule || "Schedule", icon: Calendar, href: "/dashboard/teacher/calendar", color: "text-pink-700" },
                { label: t.sidebar.exams, icon: FileText, href: "/dashboard/teacher/exams", color: "text-pink-500" },
                { label: t.sidebar.myClasses, icon: Users, href: "/halaqa", color: "text-violet-500" },
                { label: t.sidebar.messages || "Messages", icon: MessageSquare, href: "/messages", color: "text-blue-500", badge: unreadCount || 0 },
            ];
        }

        if (user.role === "staff") {
            return [
                { label: t.sidebar.dashboard || "Dashboard", icon: LayoutDashboard, href: "/dashboard/staff", color: "text-sky-500" },
                { label: t.sidebar.students, icon: Users, href: "/dashboard/manager/students", color: "text-indigo-500" },
                { label: t.sidebar.fees, icon: DollarSign, href: "/dashboard/manager/fees", color: "text-emerald-600" },
                { label: t.sidebar.messages || "Messages", icon: MessageSquare, href: "/messages", color: "text-blue-500", badge: unreadCount || 0 },
            ];
        }

        if (user.role === "librarian") {
            return [
                { label: "Library Dashboard", icon: BookOpen, href: "/dashboard/librarian", color: "text-amber-600" },
                { label: t.sidebar.messages || "Messages", icon: MessageSquare, href: "/messages", color: "text-blue-500", badge: unreadCount || 0 },
                { label: t.sidebar.settings, icon: Settings, href: "/settings" },
            ];
        }

        if (user.role === "parent") {
            return [
                { label: t.sidebar.parentView, icon: LayoutDashboard, href: "/dashboard/parent", color: "text-purple-500" },
                { label: "Library", icon: BookOpen, href: "/library", color: "text-amber-600" },
                { label: t.sidebar.schedule || "Schedule", icon: Calendar, href: "/schedule", color: "text-pink-500" },
                { label: t.sidebar.messages || "Messages", icon: MessageSquare, href: "/messages", color: "text-blue-500", badge: unreadCount || 0 },
            ];
        }

        if (user.role === "accountant") {
            return [
                { label: t.sidebar.accountantDashboard, icon: LayoutDashboard, href: "/dashboard/accountant", color: "text-emerald-600" },
                { label: t.sidebar.fees, icon: DollarSign, href: "/dashboard/manager/fees", color: "text-emerald-500" },
                { label: t.sidebar.salaries, icon: Wallet, href: "/dashboard/manager/salaries", color: "text-blue-600" },
                { label: "Expenses", icon: Wallet, href: "/dashboard/manager/finance/expenses", color: "text-red-500" },
                { label: t.sidebar.messages || "Messages", icon: MessageSquare, href: "/messages", color: "text-blue-500", badge: unreadCount || 0 },
            ];
        }

        // Student / Default
        return [
            { label: t.sidebar.dashboard, icon: LayoutDashboard, href: "/", color: "text-emerald-500" },
            { label: "My Classes", icon: Users, href: "/halaqa", color: "text-violet-500" },
            { label: t.sidebar.quranTracker, icon: BookOpen, href: "/tracker", color: "text-amber-500" },
            { label: "Library", icon: BookOpen, href: "/library", color: "text-amber-600" },
            { label: t.sidebar.assignments, icon: GraduationCap, href: "/assignments", color: "text-sky-500" },
            { label: t.sidebar.schedule, icon: Calendar, href: "/schedule", color: "text-pink-700" },
            { label: t.sidebar.settings, icon: Settings, href: "/settings" },
        ];
    };

    const currentRoutes = getRoutes();

    return (
        <motion.div
            initial={false}
            animate={{
                x: isOpen ? 0 : (locale === 'ar' ? 300 : -300),
                opacity: isOpen ? 1 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "fixed top-24 bottom-6 w-72 z-40 transition-all duration-300",
                locale === 'ar' ? "right-6" : "left-6"
            )}
        >
            <div className="h-full glass-panel rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
                {/* Decorative background blur */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="px-6 py-6 border-b border-white/10 relative z-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                            <span className="text-white font-amiri font-bold text-2xl">خ</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-amiri text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                Khalaf al Cudul
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                                Quran School
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="px-4 py-4 flex-1 overflow-y-auto no-scrollbar relative z-10 space-y-1">
                    {currentRoutes.map((route) => {
                        const isActive = pathname === route.href;
                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20 shadow-sm backdrop-blur-sm"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <div className={cn(
                                    "relative z-10 flex items-center justify-center h-8 w-8 rounded-lg transition-colors",
                                    isActive ? "bg-white/80 dark:bg-black/20 shadow-sm" : "bg-transparent group-hover:bg-white/40 dark:group-hover:bg-white/10"
                                )}>
                                    <route.icon className={cn("h-4 w-4", route.color)} />
                                </div>

                                <span className="relative z-10 font-medium text-sm flex-1">
                                    {route.label}
                                </span>

                                {(route as any).badge > 0 && (
                                    <span className="relative z-10 flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-[10px] text-white font-bold shadow-sm ring-2 ring-background">
                                        {(route as any).badge > 9 ? "9+" : (route as any).badge}
                                    </span>
                                )}

                                {isActive && (
                                    <ChevronRight className={cn(
                                        "relative z-10 h-4 w-4 text-primary opacity-50",
                                        locale === 'ar' && "rotate-180"
                                    )} />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 relative z-10 bg-gradient-to-t from-background/50 to-transparent">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-medium text-muted-foreground">System</span>
                            <LanguageSwitcher />
                        </div>
                        <SignOutButton>
                            <button className={cn(
                                "w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300",
                                "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
                            )}>
                                <LogOut className="w-4 h-4" />
                                {t.sidebar.signOut}
                            </button>
                        </SignOutButton>
                        <p className="text-[10px] text-center text-muted-foreground/40 mt-3 font-mono">
                            v2.0.0 • Project 100x
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
