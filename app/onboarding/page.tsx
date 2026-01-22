"use client";

import React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function OnboardingPage() {
    const completeOnboarding = useMutation(api.users.completeOnboarding);
    const user = useQuery(api.users.currentUser);
    const router = useRouter();

    React.useEffect(() => {
        if (user && user.role !== "guest") {
            // Already has a role, redirect
            switch (user.role) {
                case "admin":
                case "manager":
                    router.push("/dashboard/manager");
                    break;
                case "teacher":
                    router.push("/dashboard/teacher");
                    break;
                case "parent":
                    router.push("/dashboard/parent");
                    break;
                case "student":
                    router.push("/tracker");
                    break;
            }
        }
    }, [user, router]);


    const handleSelectRole = async (role: string) => {
        try {
            await completeOnboarding({ role });

            // Redirect based on role - FIXED: Use correct dashboard paths
            switch (role) {
                case "admin":
                case "manager":
                    router.push("/dashboard/manager");
                    break;
                case "teacher":
                    router.push("/dashboard/teacher");
                    break;
                case "parent":
                    router.push("/dashboard/parent");
                    break;
                case "student":
                default:
                    router.push("/tracker");
                    break;
            }
        } catch (error) {
            console.error("Onboarding failed:", error);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-5xl w-full">
                <div className="mb-16 space-y-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-amiri text-5xl md:text-7xl font-bold text-foreground tracking-tight"
                    >
                        Welcome to Al-Maqra'a
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Customize your journey by selecting your path.
                    </motion.p>
                </div>

                <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Student Card */}
                    <RoleCard
                        title="Student"
                        description="I am here to memorize and learn from the best."
                        icon={<BookOpen className="h-10 w-10 text-emerald-500" />}
                        onClick={() => handleSelectRole("student")}
                        color="emerald"
                        delay={0.2}
                    />

                    {/* Parent Card */}
                    <RoleCard
                        title="Parent"
                        description="I want to track my child's progress and stay connected."
                        icon={<Users className="h-10 w-10 text-sky-500" />}
                        onClick={() => handleSelectRole("parent")}
                        color="sky"
                        delay={0.25}
                    />

                    {/* Teacher Card */}
                    <RoleCard
                        title="Teacher"
                        description="I lead Halaqas and guide seekers of knowledge."
                        icon={<GraduationCap className="h-10 w-10 text-violet-500" />}
                        onClick={() => handleSelectRole("teacher")}
                        color="violet"
                        delay={0.3}
                    />

                    {/* Manager Card */}
                    <RoleCard
                        title="Manager"
                        description="I oversee the school operations and staff."
                        icon={<ShieldCheck className="h-10 w-10 text-amber-500" />}
                        onClick={() => handleSelectRole("manager")}
                        color="amber"
                        delay={0.35}
                    />
                </div>
            </div>
        </div>
    );
}

function RoleCard({ title, description, icon, onClick, color, delay }: any) {
    const colorClasses: Record<string, string> = {
        emerald: "hover:border-emerald-500/50 hover:shadow-emerald-500/10 group-hover:bg-emerald-500/10",
        sky: "hover:border-sky-500/50 hover:shadow-sky-500/10 group-hover:bg-sky-500/10",
        violet: "hover:border-violet-500/50 hover:shadow-violet-500/10 group-hover:bg-violet-500/10",
        amber: "hover:border-amber-500/50 hover:shadow-amber-500/10 group-hover:bg-amber-500/10",
    };

    const iconBgClasses: Record<string, string> = {
        emerald: "bg-emerald-500/10",
        sky: "bg-sky-500/10",
        violet: "bg-violet-500/10",
        amber: "bg-amber-500/10",
    };

    return (
        <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.4 } }}
            onClick={onClick}
            className={`group flex flex-col items-center justify-center gap-5 rounded-[2rem] border border-white/20 glass-panel p-8 shadow-2xl transition-all duration-500 ${colorClasses[color]}`}
        >
            <div className={`rounded-2xl p-5 transition-all duration-500 shadow-inner ${iconBgClasses[color]}`}>
                {icon}
            </div>
            <div className="text-center">
                <h3 className="text-xl font-bold mb-2 tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-2">{description}</p>
            </div>
        </motion.button>
    )
}

