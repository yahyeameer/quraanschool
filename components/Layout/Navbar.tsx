"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { Menu, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NotificationCenter } from "./NotificationCenter";
import { useLanguage } from "@/lib/language-context";
import { motion } from "framer-motion";

export function Navbar({
    onMenuClick,
    isSidebarOpen,
    pathname
}: {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
    pathname: string;
}) {
    const { locale, setLocale, dir } = useLanguage();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none print:hidden"
        >
            <div className="glass-panel mx-auto max-w-7xl rounded-2xl h-16 pointer-events-auto flex items-center justify-between px-4 shadow-lg">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 text-muted-foreground hover:text-primary rounded-xl hover:bg-accent/50 transition-colors lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Quick Action Breadcrumbs or Title */}
                    <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <span className="text-primary/50">Dashboard</span>
                        <span className="text-muted-foreground/30">/</span>
                        <span className="text-foreground">{pathname.split('/').pop()?.replace(/^\w/, c => c.toUpperCase()) || 'Overview'}</span>
                    </div>
                </div>

                {/* Search Bar (Fake) - For premium feel */}
                <div className="hidden lg:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder={locale === 'ar' ? "بحث سريع..." : "Quick search..."}
                            className="w-full bg-accent/20 border border-transparent hover:border-border focus:border-primary/50 rounded-xl py-2 pl-10 pr-4 text-sm transition-all outline-none focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/40"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1">
                            <span className="text-[10px] bg-background/50 border border-border rounded px-1.5 py-0.5 text-muted-foreground">⌘K</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                        className="h-9 px-3 text-xs font-bold rounded-xl border border-border bg-background/50 hover:bg-accent transition-colors hidden sm:block"
                    >
                        {locale === 'en' ? 'عربي' : 'English'}
                    </button>

                    <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block" />

                    <div className="flex items-center gap-1">
                        <NotificationCenter />
                    </div>

                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-10 w-10 ring-2 ring-white/20 hover:ring-primary/50 transition-all rounded-xl",
                                userButtonPopoverCard: "glass-card border-none shadow-2xl"
                            }
                        }}
                    />
                </div>
            </div>
        </motion.header>
    );
}
