"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Mail, GraduationCap, UserPlus, Trash2, Edit2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddStaffModal } from "@/components/Staff/AddStaffModal";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { EditStaffModal } from "@/components/Staff/EditStaffModal";
import { Loader2 } from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export default function ManagerStaffPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const users = useQuery(api.admin.listUsers);
    const invitations = useQuery(api.admin.listInvitations);
    const removeStaff = useMutation(api.admin.removeStaff);
    const [editingUser, setEditingUser] = useState<Doc<"users"> | null>(null);

    // Show loading state while data is fetching
    if (users === undefined || invitations === undefined) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground animate-pulse">Loading staff data...</p>
                </div>
            </div>
        );
    }

    const staff = users?.filter(u => u.role === "teacher" || u.role === "staff" || u.role === "manager") || [];
    const pendingInvitations = invitations?.filter(i => i.status === "pending") || [];

    const handleRemoveStaff = async (userId: Id<"users">) => {
        if (!confirm("Are you sure you want to remove this staff member? They will lose their access privileges.")) return;
        try {
            await removeStaff({ userId });
            toast.success("Staff member removed successfully");
        } catch (error: any) {
            toast.error(error instanceof Error ? error.message : "Failed to remove staff member");
        }
    };

    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent italic">
                            Staff Management
                        </h2>
                        <p className="text-muted-foreground mt-1">Orchestrate your team of teachers and support experts.</p>
                    </div>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl px-6 py-6 h-auto transition-all hover:scale-[1.05] shadow-xl shadow-primary/20"
                    >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Add New Staff
                    </Button>
                </div>

                {/* Pending Invitations Section */}
                {pendingInvitations.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <ShieldAlert className="h-5 w-5 text-amber-500" />
                            <h3 className="text-lg font-bold text-amber-500 italic">Pending Invitations</h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pendingInvitations.map((inv) => (
                                <Card key={inv._id} className="bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 transition-colors">
                                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                        <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-bold truncate max-w-[150px]">{inv.email}</CardTitle>
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-tighter border-amber-500/30 text-amber-500">
                                                {inv.role}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <p className="text-[10px] text-amber-500/60 font-medium">Invited on {new Date(inv.invitedAt).toLocaleDateString()}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Staff Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold text-white italic">Active Staff</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {staff.map((member) => (
                            <Card key={member._id} className="group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-white/5 bg-zinc-900/40 backdrop-blur-sm overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        onClick={() => handleRemoveStaff(member._id)}
                                        className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                        title="Remove Staff"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 group-hover:ring-primary/50 transition-all">
                                        <UserPlus className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg font-bold truncate text-white">{member.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Badge className={`${member.role === 'teacher' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' :
                                                member.role === 'manager' ? 'bg-purple-500/20 text-purple-500 border-purple-500/30' :
                                                    'bg-sky-500/20 text-sky-500 border-sky-500/30'} text-[10px] h-5 rounded-full`}>
                                                {member.role.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/5">
                                        <Mail className="h-3.5 w-3.5 text-primary/60" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="w-full text-xs font-bold border-white/10 hover:bg-white/5 h-9 rounded-xl"
                                            onClick={() => setEditingUser(member)}
                                        >
                                            <Edit2 className="h-3.5 w-3.5 mr-2" />
                                            Edit Role
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {staff.length === 0 && (
                            <div className="col-span-full text-center py-20 rounded-3xl border border-dashed border-white/10 bg-zinc-900/20">
                                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="h-6 w-6 text-zinc-500" />
                                </div>
                                <h4 className="text-zinc-400 font-bold">No Staff Found</h4>
                                <p className="text-xs text-zinc-600 mt-1">Start by inviting your first team member.</p>
                            </div>
                        )}
                    </div>
                </div>

                <AddStaffModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                />

                <EditStaffModal
                    isOpen={!!editingUser}
                    onClose={() => setEditingUser(null)}
                    user={editingUser}
                />
            </div>
        </RoleGuard>
    );
}


