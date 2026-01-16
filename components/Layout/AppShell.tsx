"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Skip dashboard layout for the landing page or onboarding
    const isLandingPage = pathname === "/";
    const isOnboarding = pathname === "/onboarding";
    const isDashboard = !isLandingPage && !isOnboarding;

    if (!isDashboard) {
        return <div className="min-h-screen bg-background font-sans">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar
                onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                pathname={pathname}
            />
            <Sidebar isOpen={isSidebarOpen} />

            <main className={cn(
                "bg-background transition-all duration-300 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8",
                "lg:ms-64" // Margin Start
            )}>
                <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-5 duration-500">
                    {children}
                </div>
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
