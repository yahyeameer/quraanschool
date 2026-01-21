"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Plus, Mail, UserPlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define proper role type
type StaffRole = "teacher" | "staff" | "manager";

export function AddStaffModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const inviteStaff = useMutation(api.admin.inviteStaff);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<StaffRole>("teacher");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await inviteStaff({ email, role });
            toast.success("Staff invitation sent successfully!");
            setEmail("");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to send invitation");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md overflow-hidden bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl p-6"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <UserPlus className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Add New Staff</h3>
                            <p className="text-xs text-zinc-400">Invite a new member to your team</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-black/40 border-white/10"
                                    placeholder="staff@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Role</Label>
                            <div className="grid grid-cols-2 gap-2">
<button
                                    type="button"
                                    onClick={() => setRole("teacher" as StaffRole)}
                                    className={`px-4 py-2 text-sm rounded-xl border transition-all ${role === "teacher"
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-black/40 border-white/10 text-zinc-400 hover:border-white/20"
                                        }`}
                                >
                                    Teacher
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("staff" as StaffRole)}
                                    className={`px-4 py-2 text-sm rounded-xl border transition-all ${role === "staff"
                                            ? "bg-sky-500/20 border-sky-500 text-sky-400"
                                            : "bg-black/40 border-white/10 text-zinc-400 hover:border-white/20"
                                        }`}
                                >
                                    Support Staff
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Send Invitation"
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
