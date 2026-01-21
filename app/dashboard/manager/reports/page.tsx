"use client";

import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, Loader2, RefreshCw } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ManagerReportsPage() {
    const data = useQuery(api.reports.getSummary);
    const chartData = data || [];

    const handleExport = () => {
        if (!data || data.length === 0) {
            toast.error("No data available to export");
            return;
        }

        const headers = ["Month", "Attendance Rate (%)", "Tuition Collected ($)"];
        const csvContent = [
            headers.join(","),
            ...data.map(row => `${row.name},${row.attendance},${row.payments}`)
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `academic_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Report downloaded successfully");
    };

    if (data === undefined) {
        return (
            <RoleGuard requiredRole="manager">
                <div className="flex h-96 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
            </RoleGuard>
        );
    }

    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent italic">
                            Academic Reports
                        </h2>
                        <p className="text-muted-foreground mt-1">Performance analytics and financial summaries.</p>
                    </div>
                    <Button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/20 font-bold transition-all hover:scale-[1.02]"
                    >
                        <Download className="h-4 w-4" />
                        Export All
                    </Button>
                </div>

                {chartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-zinc-900/20 text-center">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <FileText className="h-6 w-6 text-zinc-500" />
                        </div>
                        <h3 className="font-bold text-lg text-zinc-300">No Data Available</h3>
                        <p className="text-zinc-500 max-w-sm mt-1">Generate attendance and payment records to see analytics here.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="glass-panel border-white/5 bg-zinc-900/40">
                            <CardHeader>
                                <CardTitle className="text-white italic">Attendance Trends</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            fontSize={12}
                                            stroke="rgba(255,255,255,0.3)"
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            fontSize={12}
                                            unit="%"
                                            stroke="rgba(255,255,255,0.3)"
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#fff" }}
                                            itemStyle={{ color: "#fff" }}
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        />
                                        <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="glass-panel border-white/5 bg-zinc-900/40">
                            <CardHeader>
                                <CardTitle className="text-white italic">Tuition Collection</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            fontSize={12}
                                            stroke="rgba(255,255,255,0.3)"
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            fontSize={12}
                                            unit="$"
                                            stroke="rgba(255,255,255,0.3)"
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#fff" }}
                                            itemStyle={{ color: "#fff" }}
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            formatter={(value) => [`$${value}`, "Collected"]}
                                        />
                                        <Bar dataKey="payments" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                    {["Monthly Attendance Report", "Student Progress Summary", "Financial Statement Q1"].map((report, i) => (
                        <Card key={i} className="hover:bg-white/5 cursor-pointer transition-all border-white/5 bg-zinc-900/40 group">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                                    <FileText className="h-5 w-5 text-muted-foreground group-hover:text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">{report}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">PDF • 2.4 MB</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </RoleGuard>
    );
}
