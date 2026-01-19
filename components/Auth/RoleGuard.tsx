"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function RoleGuard({
    children,
    requiredRole
}: {
    children: React.ReactNode,
    requiredRole?: ("admin" | "manager" | "teacher" | "staff" | "parent") | ("admin" | "manager" | "teacher" | "staff" | "parent")[]
}) {
    const user = useQuery(api.users.currentUser);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (user === undefined) return; // Loading

        // 1. Guest Check (Global)
        if (user?.role === "guest" && pathname !== "/onboarding") {
            router.push("/onboarding");
            return;
        }

        // 2. Specific Page Guard
        if (requiredRole) {
            const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

            // Admin can access everything
            if (user?.role === "admin") return;

            if (!user || !allowedRoles.includes(user.role as any)) {
                // Determine redirect based on role
                if (user?.role === "admin") router.push("/admin");
                else if (user?.role === "manager") router.push("/dashboard/manager");
                else if (user?.role === "teacher") router.push("/dashboard/teacher");
                else if (user?.role === "parent") router.push("/dashboard/parent");
                else if (user?.role === "staff") router.push("/dashboard/staff");
                else router.push("/"); // Default
            }
        }

    }, [user, requiredRole, router, pathname]);

    if (user === undefined) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Role mismatch? Return null while redirect happens
    if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!user || (!allowedRoles.includes(user.role as any) && user.role !== "admin")) return null;
    }

    if (user?.role === "guest" && pathname !== "/onboarding") return null;

    return <>{children}</>;
}
