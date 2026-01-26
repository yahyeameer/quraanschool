"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    Mail,
    GraduationCap,
    UserPlus,
    Trash2,
    Edit2,
    ShieldAlert,
    Loader2,
    Sparkles,
    Search,
    User,
    ShieldCheck,
    Briefcase,
    Globe,
    Zap,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddStaffModal } from "@/components/Staff/AddStaffModal";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { EditStaffModal } from "@/components/Staff/EditStaffModal";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ManagerStaffPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const users = useQuery(api.admin.listUsers);
    const invitations = useQuery(api.admin.listInvitations);
    const removeStaff = useMutation(api.admin.removeStaff);
    const [editingUser, setEditingUser] = useState<Doc<"users"> | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Show loading state while data is fetching
    if (users === undefined || invitations === undefined) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#030712]">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-emerald-500 animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-emerald-400 animate-pulse" />
                </div>
            </div>
        );
    }

    const staff = users?.filter(u => u.role === "teacher" || u.role === "staff" || u.role === "manager" || u.role === "accountant" || u.role === "librarian" || u.role === "receptionist") || [];
    const pendingInvitations = invitations?.filter(i => i.status === "pending") || [];

    const filteredStaff = staff.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRemoveStaff = async (userId: Id<"users">) => {
        if (!confirm("Are you sure you want to remove this staff member? They will lose their access privileges.")) return;
        try {
            await removeStaff({ userId });
            toast.success("Staff member status revoked");
        } catch (error: any) {
            toast.error(error instanceof Error ? error.message : "Failed to revoke status");
        }
    };

    return (
        <RoleGuard requiredRole="manager">
            <div className="min-h-screen bg-[#030712] text-zinc-100 p-4 md:p-8 space-y-12 relative overflow-hidden">
                {/* Celestial Background Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[140px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-600/5 rounded-full blur-[120px] -z-10" />

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-5xl font-bold font-amiri tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-sky-400">
                            The Custodian Council
                        </h1>
                        <p className="text-zinc-500 mt-2 flex items-center gap-2 tracking-wide uppercase text-[10px] font-bold">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Governing the academic guardians and institutional experts.
                        </p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search the council..."
                                className="pl-12 pr-4 bg-white/5 border border-white/10 h-14 rounded-2xl w-full sm:w-[300px] focus:ring-emerald-500/30 text-sm backdrop-blur-xl outline-none transition-all placeholder:text-zinc-700 hover:bg-white/10"
                            />
                        </div>
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl h-14 px-8 shadow-xl shadow-emerald-900/20 transition-all hover:scale-[1.05] active:scale-[0.98] flex items-center gap-2"
                        >
                            <UserPlus className="h-5 w-5" />
                            Commission Staff
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-6 md:grid-cols-4">
                    <StatCard label="Active Council" value={staff.length} subtitle="Staff members" icon={Zap} color="text-emerald-400" />
                    <StatCard label="Pending Summons" value={pendingInvitations.length} subtitle="Awaitng response" icon={Mail} color="text-amber-400" />
                    <StatCard label="Teachers" value={staff.filter(s => s.role === 'teacher').length} subtitle="Murshids & Scholars" icon={GraduationCap} color="text-sky-400" />
                    <StatCard label="Support" value={staff.filter(s => s.role !== 'teacher' && s.role !== 'manager').length} subtitle="Domain specialists" icon={Briefcase} color="text-purple-400" />
                </div>

                {/* Pending Invitations Section */}
                {pendingInvitations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 px-2">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse">
                                <Mail className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold font-amiri text-amber-500 tracking-wide uppercase text-[10px]">Awaiting Astral Link</h3>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {pendingInvitations.map((inv) => (
                                <Card key={inv._id} className="bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl group">
                                    <CardHeader className="flex flex-row items-center gap-4 pb-4 px-6 pt-6">
                                        <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                                            <Globe className="h-6 w-6 text-amber-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-sm font-bold truncate text-zinc-100">{(inv as any).name || inv.email}</CardTitle>
                                            <span className="text-[10px] uppercase font-black tracking-widest text-amber-500/80">{inv.role}</span>
                                        </div>
                                    </CardHeader>
                                    <div className="px-6 pb-6 mt-1 flex justify-between items-center">
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Invited {new Date(inv.invitedAt).toLocaleDateString()}</p>
                                        <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Active Staff Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/10">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold font-amiri text-white tracking-wide uppercase text-[10px]">Active Council Manifest</h3>
                    </div>

                    {filteredStaff.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-32 border border-dashed border-white/5 rounded-[4rem] bg-zinc-900/20 backdrop-blur-3xl">
                            <User className="h-16 w-16 text-zinc-800 mb-6" />
                            <h4 className="text-zinc-500 font-bold text-xl">No celestial beings match your search</h4>
                            <p className="text-zinc-600 mt-2 text-sm tracking-widest uppercase text-[10px]">Adjust your search coordinates</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredStaff.map((member, idx) => (
                                <motion.div
                                    key={member._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card className="group relative bg-zinc-900/40 hover:bg-zinc-900/60 border border-white/5 hover:border-emerald-500/30 rounded-[3rem] p-0 backdrop-blur-3xl transition-all duration-500 shadow-2xl overflow-hidden h-full flex flex-col">
                                        {/* Actions Overlay */}
                                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-20">
                                            <button
                                                onClick={() => setEditingUser(member)}
                                                className="h-10 w-10 rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all backdrop-blur-xl border border-white/10 flex items-center justify-center"
                                                title="Edit Permissions"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveStaff(member._id)}
                                                className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all backdrop-blur-xl border border-rose-500/20 flex items-center justify-center"
                                                title="Revoke Access"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="p-8 pb-4 flex flex-col items-center text-center">
                                            <div className="relative mb-6">
                                                <div className="h-24 w-24 rounded-[40%] bg-gradient-to-br from-emerald-500/10 to-sky-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                                                    {member.avatarUrl ? (
                                                        <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <User className="h-10 w-10 text-emerald-400" />
                                                    )}
                                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-emerald-500 border-[3px] border-[#030712] flex items-center justify-center shadow-lg">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                </div>
                                            </div>

                                            <h4 className="text-xl font-bold font-amiri text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight truncate w-full">
                                                {member.name}
                                            </h4>

                                            <div className="mt-3">
                                                <Badge className={cn(
                                                    "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all",
                                                    member.role === 'teacher' && "bg-sky-500/10 text-sky-400 border-sky-500/20",
                                                    member.role === 'manager' && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                                                    member.role === 'accountant' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                                    member.role === 'librarian' && "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                                                    "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                                                )}>
                                                    {member.role}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-8 pt-4 space-y-4 flex-grow flex flex-col justify-end">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 bg-black/40 p-4 rounded-3xl border border-white/5 group-hover:border-emerald-500/20 transition-all">
                                                    <Mail className="h-4 w-4 text-emerald-500/60" />
                                                    <span className="text-xs text-zinc-400 truncate font-medium">{member.email}</span>
                                                </div>
                                                {member.phone && (
                                                    <div className="flex items-center gap-3 bg-black/40 p-4 rounded-3xl border border-white/5">
                                                        <Globe className="h-4 w-4 text-sky-500/60" />
                                                        <span className="text-xs text-zinc-400 font-mono tracking-tighter">{member.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
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

function StatCard({ label, value, subtitle, icon: Icon, color }: any) {
    return (
        <motion.div whileHover={{ y: -5 }}>
            <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group hover:border-white/20 transition-all border shadow-2xl relative">
                <div className={cn("absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform", color)}>
                    <Icon className="h-12 w-12" />
                </div>
                <CardContent className="p-8">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{label}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-bold tracking-tighter text-zinc-100">{value}</span>
                    </div>
                    <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-[0.1em] pt-4 flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3" />
                        {subtitle}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
