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
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
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

    return (
        <div className={cn(
            "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 -translate-x-full border-r border-border/50 bg-background/60 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 z-40",
            isOpen && "translate-x-0"
        )}>
            <div className="space-y-4 py-4 flex flex-col h-full">
                <div className="px-3 py-2 flex-1">
                    <div className="space-y-1">
                        {routes.map((route) => (
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
