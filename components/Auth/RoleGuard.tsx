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
    requiredRole?: "admin" | "teacher"
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
            if (!user || (user.role !== requiredRole && user.role !== "admin")) {
                // Determine redirect
                if (user?.role === "teacher") router.push("/teacher");
                else router.push("/");
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
    if (requiredRole && user?.role !== requiredRole && user?.role !== "admin") return null;
    if (user?.role === "guest" && pathname !== "/onboarding") return null;

    return <>{children}</>;
}
