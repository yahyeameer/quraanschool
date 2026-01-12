"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shield, Users, BookOpen, Crown } from "lucide-react";
import { PaymentManager } from "@/components/Admin/PaymentManager";
import { RoleGuard } from "@/components/Auth/RoleGuard";

export default function AdminPage() {
    const stats = useQuery(api.admin.getStats);
    const users = useQuery(api.admin.listUsers);
    const updateRole = useMutation(api.admin.updateUserRole);

    const handleRoleChange = async (userId: string, newRole: string) => {
        // @ts-expect-error - casting ID
        await updateRole({ userId, role: newRole });
    };

    if (!stats) return <div className="p-8">Loading dashboard...</div>;

    return (
        <RoleGuard requiredRole="admin">
            <div className="space-y-8">
                <div>
                    <h1 className="font-amiri text-3xl font-bold text-foreground">Command Center</h1>
                    <p className="text-muted-foreground">School overview and management.</p>
                </div>

                {/* School Pulse */}
                <div className="grid gap-6 sm:grid-cols-3">
                    <StatsCard
                        title="Active Students"
                        value={stats.totalStudents.toString()}
                        icon={<Users className="h-4 w-4 text-emerald-500" />}
                    />
                    <StatsCard
                        title="Ayahs Memorized"
                        value={stats.totalAyahs.toString()}
                        icon={<BookOpen className="h-4 w-4 text-violet-500" />}
                    />
                    <StatsCard
                        title="Active Halaqas"
                        value={stats.activeClasses.toString()}
                        icon={<Crown className="h-4 w-4 text-amber-500" />}
                    />
                </div>

                {/* User Directory */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 font-amiri text-xl font-bold">User Directory</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Email</th>
                                    <th className="px-4 py-3 font-medium">Role</th>
                                    <th className="px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map((user) => (
                                    <tr key={user._id} className="border-b border-border/50 last:border-0 hover:bg-accent/50">
                                        <td className="px-4 py-3 font-medium">{user.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                                  ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                    user.role === 'teacher' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-emerald-100 text-emerald-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="rounded border border-input bg-background px-2 py-1 text-xs"
                                            >
                                                <option value="student">Student</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <PaymentManager />
            </div>
        </RoleGuard>
    );
}

function StatsCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                {icon}
            </div>
            <div className="mt-2 text-2xl font-bold">{value}</div>
        </div>
    )
}
