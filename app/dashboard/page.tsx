"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Role-aware dashboard redirect page
 * Automatically routes users to their appropriate dashboard based on their role
 */
export default function DashboardRedirect() {
    const user = useQuery(api.users.currentUser);
    const router = useRouter();

    useEffect(() => {
        if (user === undefined) return; // Still loading

        if (!user) {
            // Not logged in
            router.replace("/");
            return;
        }

        // Redirect based on role
        switch (user.role) {
            case "admin":
            case "manager":
                router.replace("/dashboard/manager");
                break;
            case "teacher":
                router.replace("/dashboard/teacher");
                break;
            case "parent":
                router.replace("/dashboard/parent");
                break;
            case "staff":
                router.replace("/dashboard/staff");
                break;
            case "student":
                router.replace("/tracker");
                break;
            case "guest":
                router.replace("/onboarding");
                break;
            default:
                router.replace("/");
        }
    }, [user, router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
