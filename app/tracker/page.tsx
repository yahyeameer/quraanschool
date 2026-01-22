"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LogProgressForm } from "@/components/Tracker/LogProgressForm";
import { ProgressHistory } from "@/components/Tracker/ProgressHistory";
import { GamificationCard } from "@/components/Gamification/GamificationCard";
import { Leaderboard } from "@/components/Gamification/Leaderboard";

export default function TrackerPage() {
    const updateStreak = useMutation(api.gamification.updateStreak);

    useEffect(() => {
        // Optimistically update streak on visit
        updateStreak();
    }, [updateStreak]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-amiri text-3xl font-bold text-foreground sm:text-4xl">My Quran Tracker</h1>
                <p className="text-muted-foreground">"Read, ascend, and recite..."</p>
            </div>

            <GamificationCard />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-6">
                    <ProgressHistory />
                </div>
                <div className="lg:col-span-4 space-y-6">
                    <LogProgressForm />
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
}
