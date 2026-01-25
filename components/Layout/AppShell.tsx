"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { useLanguage } from "@/lib/language-context";

type UserRole = "admin" | "manager" | "teacher" | "staff" | "parent" | "student" | "guest";

export function AppShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(true); // Default open for desktop
    const pathname = usePathname();
    const { locale } = useLanguage();

    // Skip dashboard layout for the landing page or onboarding
    const isLandingPage = pathname === "/";
    const isOnboarding = pathname === "/onboarding";
    const isDashboard = !isLandingPage && !isOnboarding;

    if (!isDashboard) {
        return <div className="min-h-screen bg-background font-sans">{children}</div>;
    }

    // Determine required role from path
    let requiredRole: UserRole | UserRole[] | undefined = undefined;
    if (pathname.startsWith("/admin")) requiredRole = "admin";
    else if (pathname.startsWith("/dashboard/manager")) requiredRole = "manager";
    else if (pathname.startsWith("/dashboard/teacher")) requiredRole = "teacher";
    else if (pathname.startsWith("/dashboard/parent")) requiredRole = "parent";
    else if (pathname.startsWith("/dashboard/staff")) requiredRole = "staff";

    // Allow multi-role access to shared features if needed
    if (pathname === "/assignments") {
        // Shared between teacher and admin/manager
        requiredRole = ["admin", "manager", "teacher"];
    }

    return (
        <RoleGuard requiredRole={requiredRole}>
            <div className="min-h-screen bg-background font-sans relative overflow-x-hidden">
                {/* mesh gradient background handled in globals.css now, but we can add more specific layers here if needed */}

                <Navbar
                    onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                    pathname={pathname}
                />

                <Sidebar isOpen={isSidebarOpen} />

                <main className={cn(
                    "relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    "min-h-[calc(100vh-6rem)] pt-24 pb-12",
                    isSidebarOpen ? (locale === 'ar' ? "lg:mr-80 lg:ml-8" : "lg:ml-80 lg:mr-8") : "lg:mx-8",
                    "px-4 sm:px-6"
                )}>
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {children}
                    </div>
                </main>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </RoleGuard>
    );
}
