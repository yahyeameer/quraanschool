"use client";

import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText } from "lucide-react";

const data = [
    { name: 'Jan', attendance: 92, payments: 4500 },
    { name: 'Feb', attendance: 95, payments: 4800 },
    { name: 'Mar', attendance: 88, payments: 4300 },
    { name: 'Apr', attendance: 96, payments: 5100 },
    { name: 'May', attendance: 94, payments: 4900 },
];

export default function ManagerReportsPage() {
    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Academic Reports</h2>
                        <p className="text-muted-foreground">Performance analytics and financial summaries.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        <Download className="h-4 w-4" />
                        Export All
                    </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} unit="%" />
                                    <Tooltip />
                                    <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tuition Collection</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} unit="$" />
                                    <Tooltip />
                                    <Bar dataKey="payments" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {["Monthly Attendance Report", "Student Progress Summary", "Financial Statement Q1"].map((report, i) => (
                        <Card key={i} className="hover:bg-accent/5 cursor-pointer transition-colors">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-foreground" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{report}</p>
                                    <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </RoleGuard>
    );
}
