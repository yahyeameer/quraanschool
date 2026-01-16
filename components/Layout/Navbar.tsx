"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { Menu, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Navbar({
    onMenuClick,
    isSidebarOpen,
    pathname
}: {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
    pathname: string;
}) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
                <button
                    onClick={onMenuClick}
                    className="mr-4 p-2 text-muted-foreground hover:text-primary lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-2">
                    {/* Simplified for dashboard - branding is in the sidebar often, but we can keep a subtle Breadcrumb or just a clean look */}
                    <div className="font-amiri text-xl font-bold text-primary lg:hidden">
                        Khalaf Al-Cuduul
                    </div>
                </div>

                <div className="hidden lg:flex flex-1 max-w-md mx-8">
                    <div className="glass-panel rounded-full p-1 flex w-full relative h-10 items-center">
                        <Link href="/dashboard/manager" className={cn(
                            "flex-1 text-[10px] uppercase tracking-wider font-bold text-center z-10 transition-colors py-1.5 rounded-full px-2",
                            pathname === "/dashboard/manager" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}>Manager</Link>
                        <Link href="/dashboard/teacher" className={cn(
                            "flex-1 text-[10px] uppercase tracking-wider font-bold text-center z-10 transition-colors py-1.5 rounded-full px-2",
                            pathname === "/dashboard/teacher" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}>Teacher</Link>
                        <Link href="/dashboard/parent" className={cn(
                            "flex-1 text-[10px] uppercase tracking-wider font-bold text-center z-10 transition-colors py-1.5 rounded-full px-2",
                            pathname === "/dashboard/parent" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}>Parent</Link>

                        {/* Dynamic Background pill would go here with layoutId if using framer-motion */}
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-amiri">Hijri: 14 Rajab 1446</span>
                    </div>

                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/50 transition-all"
                            }
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
