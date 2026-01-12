"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users, BookOpen, Star, Clock } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { RoleGuard } from "@/components/Auth/RoleGuard";

export default function TeacherPage() {
    const classes = useQuery(api.teacher.getMyClasses);

    return (
        <RoleGuard requiredRole="teacher">
            <div className="space-y-6 pb-20">
                <div>
                    <h1 className="font-amiri text-3xl font-bold text-foreground">Teacher Cockpit</h1>
                    <p className="text-muted-foreground">Manage your halaqas and grade students.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {classes?.map(cls => (
                        <ClassCard key={cls._id} data={cls} />
                    ))}
                </div>
            </div>
        </RoleGuard>
    );
}

function ClassCard({ data }: { data: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
            <h3 className="mb-2 font-amiri text-lg font-bold text-foreground">{data.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Clock className="h-3 w-3" />
                <span>{data.schedule?.[0]?.day} {data.schedule?.[0]?.time}</span>
            </div>

            <StudentRosterDrawer classId={data._id} trigger={
                <button className="w-full rounded-md bg-primary/10 py-2 text-sm font-medium text-primary hover:bg-primary/20">
                    Open Roster
                </button>
            } />
        </div>
    )
}

function StudentRosterDrawer({ classId, trigger }: { classId: string, trigger: React.ReactNode }) {
    const data = useQuery(api.teacher.getClassDetails, { classId: classId as any });
    const logProgress = useMutation(api.tracker.logProgress);
    const logAttendance = useMutation(api.attendance.logAttendance);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    // Grading Form State
    const [rating, setRating] = useState(5);
    const [surah, setSurah] = useState("Al-Baqarah");
    const [attendanceStatus, setAttendanceStatus] = useState("present");

    const handleLog = async (studentId: string) => {
        // Log Attendance
        await logAttendance({
            studentId: studentId as any,
            classId: classId as any,
            date: new Date().toISOString().split("T")[0],
            status: attendanceStatus
        });

        // Log Progress (Mocking grading for now)
        // Note: Real app would separate these or confirm before saving
        alert(`Logged Attendance: ${attendanceStatus}`);
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent className="h-[85vh]">
                <div className="mx-auto w-full max-w-sm px-4 overflow-y-auto">
                    <DrawerHeader>
                        <DrawerTitle>{data?.name || "Class Roster"}</DrawerTitle>
                    </DrawerHeader>

                    <div className="space-y-4 py-4">
                        {data?.students?.map((student: any) => (
                            <div key={student._id} className="flex flex-col gap-3 rounded-lg border p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-muted-foreground">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{student.name}</p>
                                        <p className="text-xs text-muted-foreground">{student.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex flex-1 rounded-md bg-accent/30 p-1">
                                        {['present', 'late', 'absent'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setAttendanceStatus(status)}
                                                className={`flex-1 rounded py-1 text-xs capitalize transition-all ${attendanceStatus === status
                                                    ? (status === 'present' ? 'bg-emerald-500 text-white' :
                                                        status === 'absent' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white')
                                                    : 'text-muted-foreground hover:bg-background'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleLog(student._id)}
                                        className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
