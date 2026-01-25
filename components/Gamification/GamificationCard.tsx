"use client";

import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TiltCard } from "@/components/ui/tilt-card";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy, Star, Medal, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function GamificationCard() {
    const stats = useQuery(api.gamification.getStats, {});
    const achievements = useQuery(api.gamification.getAchievements, {});

    if (!stats) {
        return (
            <div className="glass-card border-orange-500/20 p-6 space-y-4">
                <Skeleton className="h-4 w-1/2 bg-white/10" />
                <Skeleton className="h-20 w-full bg-white/5" />
            </div>
        );
    }

    // Calculate level progress (simple formula: level * 100 points)
    const pointsForNextLevel = stats.level * 100;
    const progressPercent = (stats.points % 100) / 100 * 100;

    return (
        <TiltCard tiltIntensity={10} className="h-full">
            <div className="glass-card border-orange-500/20 bg-gradient-to-br from-orange-950/40 via-black/50 to-orange-900/20 p-6 h-full relative overflow-hidden group">
                {/* Holographic Sheen Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" style={{ backgroundSize: '200% 200%' }} />

                <div className="flex justify-between items-center mb-6 relative z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                            <Trophy className="h-5 w-5 text-orange-400" />
                        </div>
                        <h3 className="font-bold text-lg text-white">Your Progress</h3>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20 backdrop-blur-md">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 animate-pulse" />
                        <span className="font-bold text-sm text-orange-200">{stats.points} pts</span>
                    </div>
                </div>

                <div className="space-y-8 relative z-20">
                    {/* Streak Section */}
                    <div className="flex items-center gap-5">
                        <div className="relative group/streak">
                            <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full opacity-50 group-hover/streak:opacity-80 transition-opacity" />
                            <div className="h-20 w-20 rounded-full bg-gradient-to-b from-orange-500/20 to-orange-900/20 flex items-center justify-center border border-orange-500/30 shadow-[inset_0_0_20px_rgba(249,115,22,0.2)] relative z-10">
                                <Flame className={cn("h-10 w-10 transition-all duration-700", stats.currentStreak > 0 ? "text-orange-500 fill-orange-500/20 animate-fire" : "text-muted-foreground")} />
                            </div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold font-amiri text-white drop-shadow-sm">{stats.currentStreak}</div>
                            <div className="text-xs text-orange-200/60 uppercase tracking-widest font-bold">Day Streak</div>
                            <p className="text-[10px] text-white/30 mt-1 max-w-[120px]">
                                {stats.currentStreak > 3 ? "You're on fire! Keep it up!" : "Consistency is key."}
                            </p>
                        </div>
                    </div>

                    {/* Level Progress */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm items-end">
                            <span className="font-bold text-orange-300 flex items-center gap-2">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-orange-400" />
                                Level {stats.level}
                            </span>
                            <span className="text-xs font-mono text-white/40">{stats.points} / {stats.level * 100 + stats.points} XP</span>
                        </div>
                        <div className="relative h-2 w-full bg-orange-950/50 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                            />
                        </div>
                    </div>

                    {/* Recent Achievements - Holographic Badges */}
                    {achievements && achievements.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Recent Badges</h4>
                            <div className="flex gap-3">
                                {achievements.slice(0, 3).map((badge) => (
                                    <div key={badge._id} className="group/badge relative cursor-pointer" title={badge.title}>
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center relative z-10 overflow-hidden backdrop-blur-sm group-hover/badge:scale-110 transition-transform duration-300">
                                            {/* Foil Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500 rotate-45 translate-x-[-100%] group-hover/badge:translate-x-[100%] transform" style={{ transition: 'transform 0.5s, opacity 0.5s' }} />

                                            <Medal className="h-6 w-6 text-yellow-400 drop-shadow-md" />
                                        </div>
                                    </div>
                                ))}
                                <button className="h-12 w-12 rounded-xl border border-dashed border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors group/more">
                                    <Sparkles className="h-4 w-4 text-white/20 group-hover/more:text-orange-400 transition-colors" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </TiltCard>
    );
}

