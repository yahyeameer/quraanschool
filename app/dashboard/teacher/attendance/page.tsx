"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, X, Clock, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TeacherAttendancePage() {
    const [date, setDate] = useState<Date>(new Date());
    const [selectedClassId, setSelectedClassId] = useState<string>("");

    // Fetch classes taught by this teacher
    const classes = useQuery(api.classes.getTeacherClasses) || [];

    // Fetch students for selected class
    const students = useQuery(api.classes.getClassStudents,
        selectedClassId ? { classId: selectedClassId as Id<"classes"> } : "skip"
    );

    // Fetch existing attendance for this date/class
    const existingAttendance = useQuery(api.academic.getAttendanceByDate,
        selectedClassId ? { classId: selectedClassId as Id<"classes">, date: format(date, "yyyy-MM-dd") } : "skip"
    );

    const markAttendance = useMutation(api.academic.markAttendance);
    const [attendanceState, setAttendanceState] = useState<Record<string, string>>({});

    // ... (handlers keep same) ...
    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceState(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = async () => {
        // ... (keep same) ...
        if (!selectedClassId) {
            toast.error("Please select a class");
            return;
        }

        const records = (students || []).map(student => ({
            studentId: student._id,
            status: attendanceState[student._id] ||
                (existingAttendance?.find((r) => r.studentId === student._id)?.status || "present")
        }));
        try {
            await markAttendance({
                classId: selectedClassId as Id<"classes">,
                date: format(date, "yyyy-MM-dd"),
                records: records as any // Cast records if schema expectations slightly differ from map result
            });
            toast.success("Attendance saved successfully");
        } catch (error) {
            toast.error("Failed to save attendance");
        }
    };

    const getStatus = (studentId: string) => { // ... (keep same)
        if (attendanceState[studentId]) return attendanceState[studentId];
        const record = existingAttendance?.find((r: any) => r.studentId === studentId);
        return record ? record.status : "present";
    };

    if (classes && classes.length === 0) {
        return (
            <RoleGuard requiredRole="teacher">
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                    <div className="h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">No Classes Found</h2>
                        <p className="text-muted-foreground">You need to create a class before you can mark attendance.</p>
                    </div>
                    <Button asChild>
                        <a href="/halaqa">Go to My Classes</a>
                    </Button>
                </div>
            </RoleGuard>
        );
    }

    return (
        <RoleGuard requiredRole="teacher">
            <div className="space-y-8">
                {/* ... (keep header) ... */}
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent italic">
                        Daily Attendance
                    </h2>
                    <p className="text-muted-foreground mt-1">Mark student presence for your classes.</p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="space-y-2 w-full md:w-64">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Select Class</label>
                        <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                            <SelectTrigger className="bg-black/40 border-white/10">
                                <SelectValue placeholder="Choose a class..." />
                            </SelectTrigger>
                            <SelectContent>
                                {classes?.map((c: any) => (
                                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* ... (keep date picker) ... */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal bg-black/40 border-white/10",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => d && setDate(d)}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button
                        onClick={handleSave}
                        className="ml-auto bg-green-600 hover:bg-green-700 text-white font-bold px-8 shadow-lg shadow-green-600/20"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Attendance
                    </Button>
                </div>

                {/* Student List */}
                <Card className="glass-panel border-white/5">
                    <CardHeader>
                        <CardTitle>Student List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!selectedClassId ? (
                            <div className="h-40 flex items-center justify-center text-muted-foreground border-2 border-dashed border-white/10 rounded-xl">
                                Select a class to view students
                            </div>
                        ) : !students ? (
                            <div className="h-40 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : students.length === 0 ? (
                            <div className="h-40 flex items-center justify-center text-muted-foreground">
                                No students found in this class.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {students.map((student: any) => {
                                    const status = getStatus(student._id);
                                    return (
                                        <div
                                            key={student._id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold">
                                                    {student.name[0]}
                                                </div>
                                                <div className="font-bold text-white">{student.name}</div>
                                            </div>

                                            <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                                                <button
                                                    onClick={() => handleStatusChange(student._id, "present")}
                                                    className={cn(
                                                        "flex items-center gap-1 px-4 py-2 rounded-md text-sm font-bold transition-all",
                                                        status === "present"
                                                            ? "bg-emerald-500 text-white shadow-lg"
                                                            : "text-muted-foreground hover:text-white"
                                                    )}
                                                >
                                                    <Check className="h-4 w-4" />
                                                    Present
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(student._id, "absent")}
                                                    className={cn(
                                                        "flex items-center gap-1 px-4 py-2 rounded-md text-sm font-bold transition-all",
                                                        status === "absent"
                                                            ? "bg-red-500 text-white shadow-lg"
                                                            : "text-muted-foreground hover:text-white"
                                                    )}
                                                >
                                                    <X className="h-4 w-4" />
                                                    Absent
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(student._id, "late")}
                                                    className={cn(
                                                        "flex items-center gap-1 px-4 py-2 rounded-md text-sm font-bold transition-all",
                                                        status === "late"
                                                            ? "bg-amber-500 text-white shadow-lg"
                                                            : "text-muted-foreground hover:text-white"
                                                    )}
                                                >
                                                    <Clock className="h-4 w-4" />
                                                    Late
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </RoleGuard>
    );
}
