"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, User } from "lucide-react";

export default function ManagerStudentsPage() {
    const users = useQuery(api.admin.listUsers);
    const students = users?.filter(u => u.role === "student") || [];
    const parents = users?.filter(u => u.role === "parent") || [];

    const getParentName = (parentId?: string) => {
        if (!parentId) return "Not Linked";
        return parents.find(p => p._id === parentId)?.name || "Unknown";
    };

    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Student Directory</h2>
                        <p className="text-muted-foreground">Manage currently enrolled students.</p>
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <div className="p-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Student Name</th>
                                    <th className="px-4 py-3 font-medium">Email</th>
                                    <th className="px-4 py-3 font-medium">Guardian</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student._id} className="border-b border-border/50 last:border-0 hover:bg-accent/50">
                                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                                <User className="h-4 w-4" />
                                            </div>
                                            {student.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{student.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs ${student.parentId ? 'text-foreground font-medium' : 'text-muted-foreground italic'}`}>
                                                {getParentName(student.parentId)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
