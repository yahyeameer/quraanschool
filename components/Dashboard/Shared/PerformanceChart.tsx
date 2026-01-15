"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

const data = [
    { name: "Jan", average: 400 },
    { name: "Feb", average: 300 },
    { name: "Mar", average: 550 },
    { name: "Apr", average: 450 },
    { name: "May", average: 600 },
    { name: "Jun", average: 700 },
    { name: "Jul", average: 800 },
];

export function PerformanceChart() {
    const { dir } = useLanguage();

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            reversed={dir === 'rtl'}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            orientation={dir === 'rtl' ? 'right' : 'left'}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Line type="monotone" dataKey="average" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
