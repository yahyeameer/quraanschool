"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Loader2 } from "lucide-react";

export function AttendanceMarker() {
    const classes = useQuery(api.teacher.getMyClasses);
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const classDetails = useQuery(api.teacher.getClassDetails,
        selectedClassId ? { classId: selectedClassId as any } : "skip"
    );
    const students = classDetails?.students || [];
    const logAttendance = useMutation(api.attendance.logAttendance);

    const [attendanceStates, setAttendanceStates] = useState<Record<string, string>>({});

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceStates(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async () => {
        if (!selectedClassId) return;
        const date = new Date().toISOString().split('T')[0];

        try {
            await Promise.all(
                Object.entries(attendanceStates).map(([studentId, status]) =>
                    logAttendance({
                        studentId: studentId as any,
                        classId: selectedClassId as any,
                        date,
                        status
                    })
                )
            );
            alert("Attendance submitted successfully!");
        } catch (error) {
            console.error("Failed to submit attendance:", error);
        }
    };

    if (classes === undefined) return <Loader2 className="animate-spin" />;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Mark Attendance</span>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="text-sm font-normal border rounded p-1 bg-background"
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {selectedClassId ? (
                    students ? (
                        <div className="space-y-4">
                            {students.map((student: any) => (
                                <div key={student._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5">
                                    <span className="font-medium">{student.name}</span>
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleStatusChange(student._id, "present")}
                                            className={`h-8 w-8 transition-colors ${attendanceStates[student._id] === 'present' ? 'bg-emerald-100 border-emerald-500 text-emerald-600' : 'hover:bg-emerald-50'}`}
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleStatusChange(student._id, "absent")}
                                            className={`h-8 w-8 transition-colors ${attendanceStates[student._id] === 'absent' ? 'bg-red-100 border-red-500 text-red-600' : 'hover:bg-red-50'}`}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleStatusChange(student._id, "late")}
                                            className={`h-8 w-8 transition-colors ${attendanceStates[student._id] === 'late' ? 'bg-yellow-100 border-yellow-500 text-yellow-600' : 'hover:bg-yellow-50'}`}
                                        >
                                            <Clock className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full mt-4" onClick={handleSubmit} disabled={Object.keys(attendanceStates).length === 0}>
                                Submit Attendance
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    )
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        Please select a class to view the student list.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
