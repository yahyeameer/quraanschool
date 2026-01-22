"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Medal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Leaderboard() {
    const leaderboard = useQuery(api.gamification.getLeaderboard, {});

    if (!leaderboard) {
        return <Skeleton className="h-[300px] w-full" />;
    }

    return (
        <Card className="glass-panel border-yellow-500/20">
            <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Top Students
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {leaderboard.map((student, index) => (
                        <div
                            key={student.studentId}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${index === 0 ? "bg-yellow-500/10 border-yellow-500/30" :
                                    index === 1 ? "bg-gray-400/10 border-gray-400/30" :
                                        index === 2 ? "bg-amber-700/10 border-amber-700/30" :
                                            "bg-white/5 border-white/5 hover:bg-white/10"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${index < 3 ? "text-white" : "text-muted-foreground"
                                    } ${index === 0 ? "bg-yellow-500" :
                                        index === 1 ? "bg-gray-400" :
                                            index === 2 ? "bg-amber-700" : "bg-white/10"
                                    }`}>
                                    {index + 1}
                                </div>
                                <span className="font-medium text-sm">{student.studentName}</span>
                            </div>
                            <div className="font-mono text-sm text-yellow-500/80 font-bold">
                                {student.points} pts
                            </div>
                        </div>
                    ))}

                    {leaderboard.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No active students yet. Be the first!
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
