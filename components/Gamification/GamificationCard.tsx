"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy, Star, Medal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function GamificationCard() {
    const stats = useQuery(api.gamification.getStats, {});
    const achievements = useQuery(api.gamification.getAchievements, {});

    if (!stats) {
        return (
            <Card className="glass-panel border-orange-500/20">
                <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        );
    }

    // Calculate level progress (simple formula: level * 100 points)
    const pointsForNextLevel = stats.level * 100;
    const progressPercent = (stats.points % 100) / 100 * 100;

    return (
        <Card className="glass-panel border-orange-500/20 bg-gradient-to-br from-orange-950/30 to-black/40">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-orange-400 flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Your Progress
                    </CardTitle>
                    <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-orange-200">{stats.points} pts</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Streak */}
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                        <Flame className={`h-8 w-8 ${stats.currentStreak > 0 ? "text-orange-500 animate-pulse" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">{stats.currentStreak}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Day Streak</div>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-orange-300">Level {stats.level}</span>
                        <span className="text-muted-foreground">{stats.points} / {stats.level * 100 + stats.points} XP</span>
                        {/* Note: Simplified XP logic for display */}
                    </div>
                    <Progress value={progressPercent} className="h-2 bg-orange-950/50" indicatorClassName="bg-gradient-to-r from-orange-500 to-yellow-500" />
                </div>

                {/* Recent Achievements */}
                {achievements && achievements.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Recent Badges</h4>
                        <div className="flex gap-2">
                            {achievements.slice(0, 3).map((badge) => (
                                <div key={badge._id} className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center" title={badge.title}>
                                    <Medal className="h-5 w-5 text-yellow-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
