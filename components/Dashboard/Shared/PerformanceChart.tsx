"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { Loader2 } from "lucide-react";

export function PerformanceChart() {
    const { dir } = useLanguage();
    const data = useQuery(api.analytics.getAcademicVelocity);

    // Default mock data if empty (for new deployments to look good)
    const chartData = data && data.length > 0 ? data : [
        { name: "Jan", value: 0 },
        { name: "Feb", value: 0 },
        { name: "Mar", value: 0 },
        { name: "Apr", value: 0 },
        { name: "May", value: 0 },
        { name: "Jun", value: 0 },
    ];

    if (data === undefined) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} stroke="#ffffff" />
                <XAxis
                    dataKey="name"
                    stroke="#ffffff60"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    reversed={dir === 'rtl'}
                    dy={10}
                />
                <YAxis
                    stroke="#ffffff60"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    orientation={dir === 'rtl' ? 'right' : 'left'}
                    dx={-10}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                    cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVelocity)"
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
