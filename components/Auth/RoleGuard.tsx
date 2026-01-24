"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Define proper role type
type UserRole = "admin" | "manager" | "teacher" | "staff" | "accountant" | "librarian" | "receptionist" | "parent" | "student" | "guest";

export function RoleGuard({
    children,
    requiredRole
}: {
    children: React.ReactNode,
    requiredRole?: UserRole | UserRole[]
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

            // Admin and Manager can access everything
            if (user?.role === "admin" || user?.role === "manager") return;

            if (!user || !allowedRoles.includes(user.role)) {
                // Determine redirect based on role (admin is already handled above)
                if (user) {
                    const userRole = user.role;
                    if (userRole === "manager") router.push("/dashboard/manager");
                    else if (userRole === "teacher") router.push("/dashboard/teacher");
                    else if (userRole === "parent") router.push("/dashboard/parent");
                    else if (userRole === "staff") router.push("/dashboard/staff");
                    else if (userRole === "student") router.push("/tracker");
                    else router.push("/"); // Default
                } else {
                    router.push("/");
                }
                return;
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
        if (!user || (!allowedRoles.includes(user.role) && user.role !== "admin" && user.role !== "manager")) return null;
    }

    if (user?.role === "guest" && pathname !== "/onboarding") return null;

    return <>{children}</>;
}
