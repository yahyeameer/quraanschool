"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Settings,
    Users,
    Calendar,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";

const routes = [
    {
        label: "Manager",
        icon: LayoutDashboard,
        href: "/dashboard/manager",
        color: "text-emerald-500",
    },
    {
        label: "Teacher",
        icon: GraduationCap,
        href: "/dashboard/teacher",
        color: "text-sky-500",
    },
    {
        label: "Parent",
        icon: Users,
        href: "/dashboard/parent",
        color: "text-purple-500",
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

    // Determine context based on path
    const isManager = pathname?.startsWith("/dashboard/manager");
    const isTeacher = pathname?.startsWith("/dashboard/teacher");
    const isParent = pathname?.startsWith("/dashboard/parent");

    // Filter routes or show specific sets
    const getRoutes = () => {
        if (isManager) {
            return [
                { label: "Overview", icon: LayoutDashboard, href: "/dashboard/manager", color: "text-emerald-500" },
                { label: "Staff", icon: GraduationCap, href: "/dashboard/manager/staff", color: "text-sky-500" }, // Placeholder
                { label: "Students", icon: Users, href: "/dashboard/manager/students", color: "text-indigo-500" }, // Placeholder
                { label: "Reports", icon: BookOpen, href: "/dashboard/manager/reports", color: "text-amber-500" }, // Placeholder
            ];
        } else if (isTeacher) {
            return [
                { label: "Class Overview", icon: LayoutDashboard, href: "/dashboard/teacher", color: "text-sky-500" },
                { label: "Attendance", icon: Calendar, href: "/dashboard/teacher/attendance", color: "text-purple-500" },
                { label: "Assignments", icon: BookOpen, href: "/dashboard/teacher/assignments", color: "text-orange-500" },
            ];
        } else if (isParent) {
            return [
                { label: "My Child", icon: Users, href: "/dashboard/parent", color: "text-purple-500" },
                { label: "Progress", icon: GraduationCap, href: "/dashboard/parent/progress", color: "text-emerald-500" },
                { label: "Messages", icon: BookOpen, href: "/dashboard/parent/messages", color: "text-blue-500" },
            ];
        }
        // Fallback or "Home" / default sidebar if not in a specific dashboard
        return routes;
    };

    const currentRoutes = getRoutes();

    return (
        <div className={cn(
            "fixed start-0 top-16 h-[calc(100vh-4rem)] w-64 border-e border-border/50 bg-background/60 backdrop-blur-xl transition-transform duration-300 z-40",
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            "ltr:left-0 rtl:right-0",
            "rtl:translate-x-full lg:rtl:translate-x-0",
            isOpen && "rtl:translate-x-0"
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
                                    <route.icon className={cn("mr-3 h-5 w-5", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>

                <div className="px-3 py-2 border-t border-border/50">
                    <SignOutButton>
                        <button className="flex w-full items-center justify-start rounded-lg p-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/10">
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </div>
    );
}
