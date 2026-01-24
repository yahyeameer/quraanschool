"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Edit2, Shield, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Id } from "@/convex/_generated/dataModel";

// Define proper role type
type StaffRole = "teacher" | "staff" | "manager" | "accountant" | "librarian" | "receptionist";

interface EditStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        _id: Id<"users">;
        name: string;
        email: string;
        role: string;
    } | null;
}

export function EditStaffModal({ isOpen, onClose, user }: EditStaffModalProps) {
    const updateUserRole = useMutation(api.admin.updateUserRole);
    const [role, setRole] = useState<StaffRole>("teacher");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            // Check if user role is valid staff role
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
            toast.success("Staff role updated successfully!");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to update role");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md overflow-hidden bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl p-6 h-[80vh] overflow-y-auto"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                            <Edit2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Edit Staff Role</h3>
                            <p className="text-xs text-zinc-400">Update privileges for {user.name}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-1">
                            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Staff Member</p>
                            <p className="text-white font-bold">{user.name}</p>
                            <p className="text-xs text-zinc-400">{user.email}</p>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-zinc-400">Select New Role</Label>
                            <div className="grid grid-cols-1 gap-2">
                                <RoleOption
                                    currentRole={role}
                                    value="teacher"
                                    label="Teacher"
                                    description="Can manage classes and log attendance"
                                    onClick={() => setRole("teacher")}
                                />
                                <RoleOption
                                    currentRole={role}
                                    value="staff"
                                    label="Support Staff"
                                    description="Limited administrative access"
                                    onClick={() => setRole("staff")}
                                />
                                <RoleOption
                                    currentRole={role}
                                    value="manager"
                                    label="Manager"
                                    description="Full access to staff and students"
                                    onClick={() => setRole("manager")}
                                />
                                <RoleOption
                                    currentRole={role}
                                    value="accountant"
                                    label="Accountant"
                                    description="Manage school finances and fees"
                                    onClick={() => setRole("accountant")}
                                />
                                <RoleOption
                                    currentRole={role}
                                    value="librarian"
                                    label="Librarian"
                                    description="Manage books and resources"
                                    onClick={() => setRole("librarian")}
                                />
                                <RoleOption
                                    currentRole={role}
                                    value="receptionist"
                                    label="Receptionist"
                                    description="Manage visitors and calls"
                                    onClick={() => setRole("receptionist")}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading || role === user.role}
                                className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Update Role"
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
    onClick: () => void;
}

function RoleOption({ currentRole, value, label, description, onClick }: RoleOptionProps) {
    const isSelected = currentRole === value;
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${isSelected
                ? "bg-amber-500/10 border-amber-500/50"
                : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10"
                }`}
        >
            <div>
                <div className={`font-bold text-sm ${isSelected ? "text-amber-400" : "text-zinc-300"}`}>{label}</div>
                <div className="text-xs text-zinc-500">{description}</div>
            </div>
            {isSelected && <Check className="h-4 w-4 text-amber-500" />}
        </button>
    )
}
