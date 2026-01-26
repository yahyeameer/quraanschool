"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Trophy,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    AlertCircle,
    GraduationCap,
    TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StudentProfilePage() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.studentId as Id<"users">;

    const profile = useQuery(api.students.getProfile, { studentId });

    if (profile === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (profile === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-xl text-muted-foreground">Student not found.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const { student, stats, parent, classes, recentProgress, attendanceStats } = profile;

    const getAttendanceColor = (rate: number) => {
        if (rate >= 90) return "text-emerald-500";
        if (rate >= 75) return "text-yellow-500";
        return "text-red-500";
    };

    const attendanceRate = attendanceStats.total > 0
        ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
        : 100;

    return (
        <RoleGuard requiredRole={["manager", "staff", "admin"]}>
            <div className="min-h-screen p-4 md:p-8 space-y-8 bg-black/5 dark:bg-black/20">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="hover:bg-white/10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Students
                </Button>

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/40 to-blue-900/20 border border-white/10 p-8 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-grid-white/5 mask-image-gradient" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        {/* Avatar */}
                        <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20">
                            <div className="h-full w-full rounded-[20px] bg-black/40 backdrop-blur-sm overflow-hidden flex items-center justify-center">
                                {student.avatarUrl ? (
                                    <img src={student.avatarUrl} alt={student.name} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-16 w-16 text-emerald-100" />
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <h1 className="text-4xl font-bold font-amiri tracking-tight text-white">
                                    {student.name}
                                </h1>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 uppercase tracking-widest text-xs">
                                    Active Student
                                </Badge>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-zinc-400">
                                {student.email && (
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4 text-emerald-500" />
                                        <span>{student.email}</span>
                                    </div>
                                )}
                                {student.phone && (
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-4 w-4 text-blue-500" />
                                        <span>{student.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                                    <Trophy className="mr-2 h-4 w-4" />
                                    Reward Points: {stats?.points || 0}
                                </Button>
                                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl">
                                    <Clock className="mr-2 h-4 w-4 text-orange-400" />
                                    Last seen: {new Date(stats?.lastLoginDate || Date.now()).toLocaleDateString()}
                                </Button>
                            </div>
                        </div>

                        {/* Quick Stats - Right Side */}
                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md flex flex-col items-center">
                                <span className="text-3xl font-bold text-emerald-400">{student.streak || 0}</span>
                                <span className="text-xs text-zinc-400 uppercase tracking-wider">Day Streak</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md flex flex-col items-center">
                                <span className={`text-3xl font-bold ${getAttendanceColor(attendanceRate)}`}>{attendanceRate}%</span>
                                <span className="text-xs text-zinc-400 uppercase tracking-wider">Attendance</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="bg-white/5 border border-white/10 h-12 p-1 rounded-xl w-full md:w-auto">
                        <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white h-full px-6">Overview</TabsTrigger>
                        <TabsTrigger value="academics" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white h-full px-6">Academics</TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white h-full px-6">Progress History</TabsTrigger>
                    </TabsList>

                    <div className="mt-8">
                        <TabsContent value="overview">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Parent Info */}
                                <Card className="bg-white/5 border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-purple-400" />
                                            Parent/Guardian Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {parent ? (
                                            <>
                                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                                                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xl">
                                                        {parent.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg">{parent.name}</p>
                                                        <p className="text-sm text-zinc-400">Relationship: Parent</p>
                                                    </div>
                                                </div>
                                                <div className="grid gap-3">
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                                        <span className="text-sm text-zinc-400">Email</span>
                                                        <span className="text-sm font-medium">{parent.email}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                                        <span className="text-sm text-zinc-400">Phone</span>
                                                        <span className="text-sm font-medium">{parent.phone || "N/A"}</span>
                                                    </div>
                                                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                                        <MessageCircle className="mr-2 h-4 w-4" />
                                                        Contact Parent
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-8 text-zinc-500">
                                                <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                                <p>No parent account linked.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Attendance Breakdown */}
                                <Card className="bg-white/5 border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-orange-400" />
                                            Attendance Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center text-sm">
                                                <span>Total Classes</span>
                                                <span className="font-bold">{attendanceStats.total}</span>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs text-zinc-400">
                                                        <span>Present</span>
                                                        <span>{attendanceStats.present}</span>
                                                    </div>
                                                    <Progress value={(attendanceStats.present / attendanceStats.total) * 100} className="h-2 bg-white/10 [&>div]:bg-emerald-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs text-zinc-400">
                                                        <span>Late</span>
                                                        <span>{attendanceStats.late}</span>
                                                    </div>
                                                    <Progress value={(attendanceStats.late / attendanceStats.total) * 100} className="h-2 bg-white/10 [&>div]:bg-yellow-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs text-zinc-400">
                                                        <span>Absent</span>
                                                        <span>{attendanceStats.absent}</span>
                                                    </div>
                                                    <Progress value={(attendanceStats.absent / attendanceStats.total) * 100} className="h-2 bg-white/10 [&>div]:bg-red-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="academics">
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-blue-400" />
                                    Enrolled Classes
                                </h3>
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {classes.map((enrollment) => (
                                        <Card key={enrollment._id} className="bg-white/5 border-white/10 hover:border-blue-500/50 transition-colors">
                                            <CardContent className="p-6 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-lg">{enrollment.classData?.name || "Unknown Class"}</h4>
                                                        <p className="text-sm text-zinc-400">{enrollment.classData?.category}</p>
                                                    </div>
                                                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                                                        {enrollment.status}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2 pt-2">
                                                    <div className="flex items-center text-sm text-zinc-300">
                                                        <Clock className="mr-2 h-4 w-4 opacity-50" />
                                                        {enrollment.classData?.schedule?.map(s => `${s.day} ${s.time}`).join(", ") || "No Schedule"}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {classes.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-zinc-500">
                                            No active enrollments found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="history">
                            <Card className="bg-white/5 border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-pink-400" />
                                        Recent Progress Logs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentProgress.map((log) => (
                                            <div key={log._id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-base">{log.surahName || log.topic || "General Log"}</h4>
                                                        <span className="text-sm text-zinc-500">{new Date(log.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-zinc-400 mt-1">
                                                        {log.ayahStart && log.ayahEnd ? `Ayah ${log.ayahStart} - ${log.ayahEnd}` : log.notes || "No details provided"}
                                                    </p>
                                                </div>
                                                {log.rating && (
                                                    <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                                        <span className="text-yellow-500 font-bold">{log.rating}</span>
                                                        <span className="text-xs text-yellow-500/70">/ 5</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {recentProgress.length === 0 && (
                                            <div className="py-12 text-center text-zinc-500">
                                                No progress history available yet.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </RoleGuard>
    );
}

function MessageCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    )
}
