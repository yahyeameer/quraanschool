"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock } from "lucide-react";

export default function TeacherDashboard() {
    const students = [
        { id: 1, name: "Ahmed Ali", status: "present" },
        { id: 2, name: "Fatima Noor", status: "absent" },
        { id: 3, name: "Omar Hassan", status: "late" },
        { id: 4, name: "Zainab Yusuf", status: "present" },
        { id: 5, name: "Khalid Ibrahim", status: "present" },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance - Hifz Class A</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {students.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <span className="font-medium">{student.name}</span>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="outline" className={`h-8 w-8 hover:bg-emerald-100 ${student.status === 'present' ? 'bg-emerald-100 border-emerald-500' : ''}`}>
                                            <Check className="h-4 w-4 text-emerald-600" />
                                        </Button>
                                        <Button size="icon" variant="outline" className={`h-8 w-8 hover:bg-red-100 ${student.status === 'absent' ? 'bg-red-100 border-red-500' : ''}`}>
                                            <X className="h-4 w-4 text-red-600" />
                                        </Button>
                                        <Button size="icon" variant="outline" className={`h-8 w-8 hover:bg-yellow-100 ${student.status === 'late' ? 'bg-yellow-100 border-yellow-500' : ''}`}>
                                            <Clock className="h-4 w-4 text-yellow-600" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Button className="w-full">Submit Attendance</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recitation Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-10 text-muted-foreground">
                            <p>Select a student to view waveform</p>
                            {/* Placeholder for progress viz */}
                            <div className="mt-4 h-32 w-full bg-muted/50 rounded-lg animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
