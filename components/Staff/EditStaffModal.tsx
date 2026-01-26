"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Loader2,
    Edit2,
    Shield,
    X,
    Check,
    Sparkles,
    User,
    Mail,
    ShieldCheck,
    Zap,
    Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

type StaffRole = "teacher" | "staff" | "manager" | "accountant" | "librarian" | "receptionist";

interface EditStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        _id: Id<"users">;
        name: string;
        email?: string;
        role: string;
    } | null;
}

export function EditStaffModal({ isOpen, onClose, user }: EditStaffModalProps) {
    const updateUserRole = useMutation(api.admin.updateUserRole);
    const [role, setRole] = useState<StaffRole>("teacher");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            if (["teacher", "staff", "manager", "accountant", "librarian", "receptionist"].includes(user.role)) {
                setRole(user.role as StaffRole);
            } else {
                setRole("teacher");
            }
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            await updateUserRole({ userId: user._id, role });
            toast.success("Alignment updated successfully!", {
                icon: <Sparkles className="h-4 w-4 text-emerald-400" />
            });
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to update alignment");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    className="relative w-full max-w-xl overflow-hidden bg-[#030712] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(251,191,36,0.05)] p-8 md:p-12 overflow-y-auto max-h-[90vh]"
                >
                    {/* Background Glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -z-10" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -z-10" />

                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 text-zinc-500 hover:text-white rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="flex items-center gap-6 mb-12">
                        <div className="h-16 w-16 flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                            <Edit2 className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold font-amiri text-white tracking-tight">Realign Domain</h3>
                            <p className="text-sm text-zinc-500 tracking-widest uppercase mt-1">Adjust staff member's cosmic alignment</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <User className="h-16 w-16" />
                            </div>
                            <div className="relative z-10 flex flex-col gap-2">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black">Designated Scholar</p>
                                <h4 className="text-2xl font-bold font-amiri text-white uppercase tracking-tight">{user.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                                    <Mail className="h-3.5 w-3.5 text-amber-500/40" />
                                    {user.email || "No email available"}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">New Alignment Role</Label>
                            <div className="grid grid-cols-1 gap-3">
                                <RoleOption
                                    currentRole={role}
                                    value="teacher"
                                    label="Teacher / Murshid"
                                    description="Guidance, scholars, and educational flow"
                                    icon={Briefcase}
                                    onClick={() => setRole("teacher")}
                                />
                                <RoleOption
                                    currentRole={role}
                                    value="manager"
                                    label="Domain Manager"
                                    description="Full structural and institutional control"
                                    icon={ShieldCheck}
                                    onClick={() => setRole("manager")}
                                />
                                <RoleOption
                                    currentRole={role}
                                    value="accountant"
                                    label="Fiscal Officer"
                                    description="Managing wealth and institutional fees"
                                    icon={Zap}
                                    onClick={() => setRole("accountant")}
                                />
                                <RoleOption
                                    currentRole={role}
                                    value="librarian"
                                    label="Keeper of Books"
                                    description="Managing resources and divine records"
                                    icon={Sparkles}
                                    onClick={() => setRole("librarian")}
                                />
                                <RoleOption
                                    currentRole={role}
                                    value="staff"
                                    label="Support Support"
                                    description="Operational support and domain maintenance"
                                    icon={Shield}
                                    onClick={() => setRole("staff")}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading || role === user.role}
                                className="w-full h-16 rounded-[1.5rem] bg-amber-500 hover:bg-amber-600 text-black font-black text-lg tracking-tight shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-30 disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-black" />
                                ) : (
                                    <>
                                        <ShieldCheck className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                        Commit Alignment
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

interface RoleOptionProps {
    currentRole: StaffRole;
    value: StaffRole;
    label: string;
    description: string;
    icon: any;
    onClick: () => void;
}

function RoleOption({ currentRole, value, label, description, icon: Icon, onClick }: RoleOptionProps) {
    const isSelected = currentRole === value;
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "w-full text-left p-6 rounded-[1.5rem] border transition-all flex items-center justify-between group h-24",
                isSelected
                    ? "bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5"
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
            )}
        >
            <div className="flex items-center gap-6">
                <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                    isSelected ? "bg-amber-500/20 text-amber-500" : "bg-white/5 text-zinc-600 group-hover:text-zinc-400 group-hover:bg-white/10"
                )}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <div className={cn("font-bold text-lg font-amiri tracking-wide transition-colors uppercase", isSelected ? "text-amber-400" : "text-zinc-400 group-hover:text-zinc-200")}>{label}</div>
                    <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{description}</div>
                </div>
            </div>
            {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="h-6 w-6 text-amber-500" />
                </motion.div>
            )}
        </button>
    )
}
