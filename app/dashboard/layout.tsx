"use client";

import { RoleGuard } from "@/components/Auth/RoleGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard>
            {children}
        </RoleGuard>
    );
}
