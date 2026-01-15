"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressRing } from "@/components/Dashboard/ProgressRing";
import { Bell, Calendar } from "lucide-react";

export default function ParentDashboard() {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Parent Dashboard</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>My Child's Progress</CardTitle>
                        <CardDescription>Current Goal: Juz Amma</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center py-6">
                        <ProgressRing progress={65} label="Surah Al-Mulk" subLabel="Excellent" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start p-3 bg-accent/20 rounded-lg">
                                <Bell className="h-5 w-5 text-primary mt-1" />
                                <div>
                                    <p className="font-medium">New Assignment Added</p>
                                    <p className="text-sm text-muted-foreground">Teacher assigned Surah Al-Qalam 1-15.</p>
                                    <span className="text-xs text-muted-foreground pt-1 block">2 hours ago</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-3 bg-background border rounded-lg">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-medium">Upcoming Exam</p>
                                    <p className="text-sm text-muted-foreground">End of term exam next week.</p>
                                    <span className="text-xs text-muted-foreground pt-1 block">Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
