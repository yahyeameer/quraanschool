"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, GraduationCap } from "lucide-react";

export default function ManagerStaffPage() {
    const users = useQuery(api.admin.listUsers);
    const staff = users?.filter(u => u.role === "teacher" || u.role === "staff") || [];

    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
                        <p className="text-muted-foreground">Directory of teachers and support staff.</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {staff.map((member) => (
                        <Card key={member._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{member.name}</CardTitle>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium 
                                        ${member.role === 'teacher' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                                        {member.role.toUpperCase()}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {member.email}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button className="text-xs bg-accent hover:bg-accent/80 px-3 py-1.5 rounded-md transition-colors w-full font-medium">
                                        View Profile
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {staff.length === 0 && (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No staff members found.
                        </div>
                    )}
                </div>
            </div>
        </RoleGuard>
    );
}
