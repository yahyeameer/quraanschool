"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressRing } from "@/components/Dashboard/ProgressRing";
import { Bell, Calendar, User, Book, CheckCircle, Clock, DollarSign } from "lucide-react";
import { RoleGuard } from "@/components/Auth/RoleGuard";

export default function ParentDashboard() {
    // @ts-ignore
    const children = useQuery(api.parent.getChildren);
    const [selectedChildId, setSelectedChildId] = useState<string>("");

    // Automatically select first child if none selected
    if (children && children.length > 0 && !selectedChildId) {
        setSelectedChildId(children[0]._id);
    }

    // @ts-ignore
    const data = useQuery(api.parent.getChildDashboardData,
        selectedChildId ? { studentId: selectedChildId as any } : "skip"
    );

    return (
        <RoleGuard requiredRole="parent">
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Parent Portal</h2>
                        <p className="text-muted-foreground">Monitor your children's Islamic education progress.</p>
                    </div>
                    {children && children.length > 1 && (
                        <select
                            value={selectedChildId}
                            onChange={(e) => setSelectedChildId(e.target.value)}
                            className="rounded-md border p-2 bg-background text-sm"
                        >
                            {children.map((child: any) => (
                                <option key={child._id} value={child._id}>{child.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {!selectedChildId ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <User className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-bold">No Children Linked</h3>
                        <p className="text-muted-foreground">Please contact administration to link your child's account.</p>
                    </div>
                ) : !data ? (
                    <div className="text-center py-20">Loading child data...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Highlights */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Daily Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center">
                                <ProgressRing
                                    progress={65}
                                    label={data.progress[0]?.surahName || "Starting..."}
                                    subLabel={data.progress[0]?.status || "Active"}
                                />
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-medium">Latest Recitation:</p>
                                    <p className="text-xs text-muted-foreground">
                                        Ayah {data.progress[0]?.ayahStart} - {data.progress[0]?.ayahEnd}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attendance Snapshot */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Attendance History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {data.attendance.slice(0, 5).map((att: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                <span>{new Date(att.date).toLocaleDateString()}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold
                                                ${att.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                                                    att.status === 'late' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                {att.status}
                                            </span>
                                        </div>
                                    ))}
                                    {data.attendance.length === 0 && (
                                        <p className="text-center py-4 text-muted-foreground text-xs">No records found</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Payments */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Tuition Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {data.payments.map((p: any) => (
                                        <div key={p._id} className="flex items-center justify-between p-2 border rounded bg-accent/5">
                                            <div>
                                                <p className="text-xs font-bold">{p.month}</p>
                                                <p className="text-[10px] text-muted-foreground">{new Date(p.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-emerald-600">${p.amount}</p>
                                                <span className="text-[9px] uppercase font-bold text-emerald-500">PAID</span>
                                            </div>
                                        </div>
                                    ))}
                                    {data.payments.length === 0 && (
                                        <div className="text-center py-6 border-2 border-dashed rounded text-muted-foreground">
                                            <DollarSign className="h-5 w-5 mx-auto mb-1 opacity-20" />
                                            <p className="text-[10px]">No payment history available</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Feed */}
                        <Card className="md:col-span-2 lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Academic Logbook</CardTitle>
                                <CardDescription>Detailed history of recitations and teacher notes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.progress.map((log: any) => (
                                        <div key={log._id} className="flex gap-4 p-4 border rounded-xl hover:bg-accent/5 transition-colors">
                                            <div className="rounded-full bg-primary/10 h-10 w-10 flex items-center justify-center shrink-0">
                                                <Book className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold">{log.surahName}</h4>
                                                    <span className="text-xs text-muted-foreground">{new Date(log.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm">Ayah {log.ayahStart} - {log.ayahEnd}</p>
                                                {log.notes && (
                                                    <p className="mt-2 text-xs text-muted-foreground italic border-l-2 pl-3 py-1">
                                                        "{log.notes}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase
                                                    ${log.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {log.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}
