"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, CreditCard, ShieldCheck } from "lucide-react";
import { RoleGuard } from "@/components/Auth/RoleGuard";

export default function StaffDashboard() {
    return (
        <RoleGuard requiredRole="staff">
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Staff Operations</h2>
                    <p className="text-muted-foreground">Front-desk and administrative support center.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Daily Check-ins</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">128</div>
                            <p className="text-xs text-muted-foreground">Students checked in today</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12</div>
                            <p className="text-xs text-muted-foreground">Pending verification</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Student Lookup</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Search student name or ID..."
                                />
                                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                                    Search
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment collection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Record over-the-counter payments quickly.</p>
                            <button className="w-full flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                                <CreditCard className="h-4 w-4" />
                                Open Cashier
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RoleGuard>
    );
}
