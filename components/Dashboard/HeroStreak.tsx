"use client";

import React from "react";
import { Flame, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function HeroStreak() {
    // Mock data for now
    const streak = 12;
    const nextGoal = 15;
    const progress = (streak / nextGoal) * 100;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-lg">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-foreground/80">
                        <Flame className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium uppercase tracking-wider">Prophetic Streak</span>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-baseline gap-2"
                    >
                        <h2 className="font-amiri text-5xl font-bold">{streak}</h2>
                        <span className="text-lg opacity-80">Days</span>
                    </motion.div>
                    <p className="max-w-md text-sm text-primary-foreground/80">
                        "The most beloved deeds to Allah are those that are consistent, even if they are small."
                    </p>
                </div>

                <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:mt-0">
                    <div className="relative flex h-20 w-20 items-center justify-center">
                        {/* Simple CSS ring or SVG for progress */}
                        <svg className="h-full w-full -rotate-90 text-primary-foreground/20" viewBox="0 0 36 36">
                            <path
                                className="fill-none stroke-current stroke-[3]"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <motion.svg
                            className="absolute h-full w-full -rotate-90 text-amber-400"
                            viewBox="0 0 36 36"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progress / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <path
                                className="fill-none stroke-current stroke-[3] stroke-cap-round"
                                strokeDasharray="100, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </motion.svg>
                        <div className="absolute flex flex-col items-center">
                            <Trophy className="h-6 w-6 text-amber-400" />
                        </div>
                    </div>
                    <span className="text-xs font-medium">Next Milestone: {nextGoal}</span>
                </div>
            </div>
        </div>
    );
}
