"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, Calendar, Award } from "lucide-react";
import { format } from "date-fns";

export default function ManagerAcademicPage() {
    // Queries for manager overview
    const exams = useQuery(api.academic.getExams, {}); // Fetch all exams

    // In a real app, we'd have dedicated aggregation queries for these stats
    // Mocking aggregations for MVP based on available data

    if (exams === undefined) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const totalExams = exams.length;
    const completedExams = exams.filter(e => e.status === "completed").length;

    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-8">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent italic">
                        Academic Overview
                    </h2>
                    <p className="text-muted-foreground mt-1">Monitor school-wide academic performance and attendance.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="glass-panel bg-orange-900/10 border-orange-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-500">Total Exams</CardTitle>
                            <Award className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-400">{totalExams}</div>
                            <p className="text-xs text-muted-foreground mt-1">{completedExams} completed</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-panel bg-pink-900/10 border-pink-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-pink-500">Avg Attendance</CardTitle>
                            <TrendingUp className="h-4 w-4 text-pink-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-pink-400">--%</div>
                            <p className="text-xs text-muted-foreground mt-1">School-wide average</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="glass-panel border-white/5">
                        <CardHeader>
                            <CardTitle>Recent Exams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {exams.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">No exams scheduled.</p>
                                ) : (
                                    exams.slice(0, 5).map(exam => (
                                        <div key={exam._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div>
                                                <div className="font-bold text-white">{exam.title}</div>
                                                <div className="text-xs text-muted-foreground">{exam.subject} • {format(new Date(exam.date), 'MMM d, yyyy')}</div>
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded-full border ${exam.status === 'completed'
                                                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                                }`}>
                                                {exam.status.toUpperCase()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Placeholder for Attendance Charts */}
                    <Card className="glass-panel border-white/5">
                        <CardHeader>
                            <CardTitle>Attendance Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground bg-black/20 rounded-xl border border-white/5 border-dashed">
                            <div className="text-center">
                                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Select a class to view detailed attendance reports</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RoleGuard>
    );
}
