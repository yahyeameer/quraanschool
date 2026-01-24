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
    Bus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";
import { LanguageSwitcher } from "@/components/Layout/LanguageSwitcher";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/", // Home/Overview
        color: "text-emerald-500",
    },
    {
        label: "My Halaqa",
        icon: Users,
        href: "/halaqa",
        color: "text-violet-500",
    },
    {
        label: "Quran Tracker",
        icon: BookOpen,
        href: "/tracker",
        color: "text-amber-500",
    },
    {
        label: "Assignments",
        icon: GraduationCap,
        href: "/assignments",
        color: "text-sky-500",
    },
    {
        label: "Schedule",
        icon: Calendar,
        href: "/schedule",
        color: "text-pink-700",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
    const pathname = usePathname();
    const user = useQuery(api.users.currentUser);
    const unreadCount = useQuery(api.messages.getUnreadCount);
    const { t } = useLanguage();

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
        <div className={cn(
            "fixed start-0 top-16 h-[calc(100vh-4rem)] w-64 border-e border-border/50 bg-background/60 backdrop-blur-xl transition-transform duration-300 z-40",
            isOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full lg:translate-x-0",
            // Helper classes for RTL sidebar logic were missing or confusing, simplifying:
            // "ltr:left-0 rtl:right-0",
            // "rtl:translate-x-full lg:rtl:translate-x-0",
            // isOpen && "rtl:translate-x-0"
        )}>
            <div className="space-y-4 py-4 flex flex-col h-full">
                <div className="px-6 py-4 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/20 group-hover:border-emerald-500 transition-all duration-300">
                            <div className="absolute inset-0 bg-primary flex items-center justify-center text-white font-bold">K</div>
                        </div>
                        <span className="font-amiri text-xl font-bold text-primary">Khalaf al Cudul</span>
                    </Link>
                </div>
                <div className="px-3 py-2 flex-1 scrollbar-hide overflow-y-auto">
                    <div className="space-y-1">
                        {currentRoutes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "group flex w-full items-center justify-start rounded-lg p-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                                    pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("mr-3 h-5 w-5 rtl:ml-3 rtl:mr-0", route.color)} />
                                    {route.label}
                                </div>
                                {(route as any).badge > 0 && (
                                    <span className="ml-auto h-5 min-w-5 px-1 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                                        {(route as any).badge > 9 ? "9+" : (route as any).badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border/50 space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground/50 px-2">
                            Ver. 1.0.0 (Beta)
                        </p>
                        <LanguageSwitcher />
                    </div>
                    <SignOutButton>
                        <button className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                            "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        )}>
                            <LogOut className="w-5 h-5" />
                            {t.sidebar.signOut}
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </div>
    );
}
