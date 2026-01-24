"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shield, Users, BookOpen, Crown } from "lucide-react";
import { PaymentManager } from "@/components/Admin/PaymentManager";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { toast } from "sonner";
import { CreateHalaqaForm } from "@/components/Halaqa/CreateHalaqaForm";
import { HalaqaCard } from "@/components/Halaqa/HalaqaCard";
import { Id } from "@/convex/_generated/dataModel";

// Define proper types
type UserRole = "admin" | "manager" | "teacher" | "staff" | "parent" | "student" | "guest";

export default function AdminPage() {
    const stats = useQuery(api.admin.getStats);
    const users = useQuery(api.admin.listUsers);
    const halaqas = useQuery(api.classes.list);
    const updateRole = useMutation(api.admin.updateUserRole);
    const linkParent = useMutation(api.admin.linkStudentToParent);

    const handleRoleChange = async (userId: Id<"users">, newRole: UserRole) => {
        try {
            await updateRole({
                userId,
                role: newRole
            });
            toast.success("User role updated");
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    const handleParentLink = async (studentId: Id<"users">, parentId: string) => {
        try {
            await linkParent({
                studentId,
                parentId: parentId === "" ? undefined : parentId as Id<"users">
            });
            toast.success("Parent linked successfully");
        } catch (error) {
            toast.error("Failed to link parent");
        }
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
                                        <td className="px-4 py-3 flex gap-2">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value as UserRole)}
                                                className="rounded border border-input bg-background px-2 py-1 text-xs"
                                            >
                                                <option value="student">Student</option>
                                                <option value="parent">Parent</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="admin">Admin</option>
                                            </select>

                                            {user.role === "student" && (
                                                <select
                                                    value={user.parentId || ""}
                                                    onChange={(e) => handleParentLink(user._id, e.target.value)}
                                                    className="rounded border border-input bg-background px-2 py-1 text-xs"
                                                >
                                                    <option value="">No Parent</option>
                                                    {users?.filter(u => u.role === "parent").map(p => (
                                                        <option key={p._id} value={p._id}>P: {p.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <PaymentManager />

                {/* Halaqa Management */}
                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-amiri text-2xl font-bold">Academic Structure</h3>
                            <p className="text-sm text-muted-foreground">Manage your circles and classes.</p>
                        </div>
                        <div className="grid gap-4">
                            {halaqas?.map((halaqa) => (
                                <HalaqaCard key={halaqa._id} data={halaqa as any} />
                            ))}
                            {halaqas?.length === 0 && (
                                <p className="py-10 text-center text-sm text-muted-foreground">No halaqas created yet.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <CreateHalaqaForm onSuccess={() => { }} />
                    </div>
                </div>
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
