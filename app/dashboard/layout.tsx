"use client";

import { AppShell } from "@/components/Layout/AppShell";
import { RoleGuard } from "@/components/Auth/RoleGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard>
            {/* AppShell provides the Sidebar and Navbar */}
            <AppShell>
                {children}
            </AppShell>
        </RoleGuard>
    );
}
