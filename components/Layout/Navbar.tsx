"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { Menu, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar({
    onMenuClick,
    isSidebarOpen
}: {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
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
                    {/* Logo Icon or Bismillah calligraphy could go here */}
                    <div className="font-amiri text-2xl font-bold tracking-wide text-primary">
                        Khalaf Al-Cuduul
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
