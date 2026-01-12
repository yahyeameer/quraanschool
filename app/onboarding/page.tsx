"use client";

import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, ShieldCheck } from "lucide-react";

export default function OnboardingPage() {
    const completeOnboarding = useMutation(api.users.completeOnboarding);
    const router = useRouter();

    const handleSelectRole = async (role: string) => {
        try {
            await completeOnboarding({ role });

            // Redirect based on role
            if (role === "admin") router.push("/admin");
            else if (role === "teacher") router.push("/teacher");
            else router.push("/"); // Student

        } catch (error) {
            console.error("Onboarding failed:", error);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <div className="mb-12 space-y-2">
                <h1 className="font-amiri text-4xl font-bold text-foreground">Welcome to Khalaf Al-Cuduul</h1>
                <p className="text-lg text-muted-foreground">Please tell us who you are to personalize your experience.</p>
            </div>

            <div className="grid w-full max-w-4xl gap-6 md:grid-cols-3">
                {/* Student Card */}
                <RoleCard
                    title="Student"
                    description="I am here to memorize and learn."
                    icon={<BookOpen className="h-12 w-12 text-emerald-500" />}
                    onClick={() => handleSelectRole("student")}
                    color="emerald"
                />

                {/* Teacher Card */}
                <RoleCard
                    title="Teacher"
                    description="I lead Halaqas and grade students."
                    icon={<GraduationCap className="h-12 w-12 text-violet-500" />}
                    onClick={() => handleSelectRole("teacher")}
                    color="violet"
                />

                {/* Manager Card */}
                <RoleCard
                    title="Manager"
                    description="I manage the school and staff."
                    icon={<ShieldCheck className="h-12 w-12 text-amber-500" />}
                    onClick={() => handleSelectRole("admin")}
                    color="amber"
                />
            </div>
        </div>
    );
}

function RoleCard({ title, description, icon, onClick, color }: any) {
    const colorClasses = {
        emerald: "hover:border-emerald-500 hover:shadow-emerald-500/10",
        violet: "hover:border-violet-500 hover:shadow-violet-500/10",
        amber: "hover:border-amber-500 hover:shadow-amber-500/10",
    };

    return (
        <button
            onClick={onClick}
            className={`group flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${colorClasses[color as keyof typeof colorClasses]}`}
        >
            <div className="rounded-full bg-accent/50 p-6 transition-colors group-hover:bg-accent">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </button>
    )
}
