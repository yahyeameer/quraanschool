"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LogProgressForm } from "@/components/Tracker/LogProgressForm";
import { ProgressHistory } from "@/components/Tracker/ProgressHistory";
import { GamificationCard } from "@/components/Gamification/GamificationCard";
import { Leaderboard } from "@/components/Gamification/Leaderboard";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Trophy, Star } from "lucide-react";

export default function TrackerPage() {
    const updateStreak = useMutation(api.gamification.updateStreak);
    const user = useQuery(api.users.currentUser);

    useEffect(() => {
        if (user) {
            updateStreak();
        }
    }, [user, updateStreak]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-20"
        >
            {/* Premium Header */}
            <motion.div variants={item} className="relative rounded-[32px] overflow-hidden p-8 text-white min-h-[200px] flex flex-col justify-center shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent to-transparent" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-emerald-100">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Student Portal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-amiri mb-2">
                        Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-emerald-100 text-lg max-w-xl">
                        "Read, ascend, and recite..." Continue your journey today.
                    </p>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left Column: Progress & Logging */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Log Progress Section */}
                    <motion.div variants={item}>
                        <LogProgressForm />
                    </motion.div>

                    {/* History Section */}
                    <motion.div variants={item}>
                        <ProgressHistory />
                    </motion.div>
                </div>

                {/* Right Column: Gamification */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div variants={item}>
                        <GamificationCard />
                    </motion.div>

                    <motion.div variants={item}>
                        <Leaderboard />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
