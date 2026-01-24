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
type StaffRole = "teacher" | "staff" | "manager" | "accountant" | "librarian" | "receptionist";

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
                    className="relative w-full max-w-lg overflow-hidden bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl p-6"
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
                                {[
                                    { value: "teacher", label: "Teacher", color: "primary" },
                                    { value: "staff", label: "Support Staff", color: "sky" },
                                    { value: "manager", label: "Manager", color: "amber" },
                                    { value: "accountant", label: "Accountant", color: "emerald" },
                                    { value: "librarian", label: "Librarian", color: "violet" },
                                    { value: "receptionist", label: "Receptionist", color: "orange" },
                                ].map((option) => {
                                    const isSelected = role === option.value;
                                    // Construct class names manually to avoid dynamic Tailwind classes issue if safe list isn't set
                                    // But user asked for generic beautiful UI, assuming Tailwind is standard.
                                    // Safer to use conditional logic for classes or basic colors if dynamic `bg-${color}-500` is risky.
                                    // I'll stick to a simpler approach or standard colors if I'm not sure about safelist.
                                    // Actually, standard Tailwind classes like bg-emerald-500 should work if they are used elsewhere or JIT is on.
                                    // To be safe I will use specific classes for each or `cn` if I had it, or just use the logic I had.
                                    // Let's use a switch/map for style to be safe or just risk it if JIT.
                                    // Given I don't want to debug Tailwind JIT issues, I'll use specific conditions if needed, 
                                    // BUT the previous code block used template literals. I'll stick to what I proposed but maybe simpler.

                                    let activeClass = "";
                                    let inactiveClass = "bg-black/40 border-white/10 text-zinc-400 hover:border-white/20 hover:bg-white/5";

                                    switch (option.color) {
                                        case 'primary': activeClass = "bg-primary/20 border-primary text-primary"; break;
                                        case 'sky': activeClass = "bg-sky-500/20 border-sky-500 text-sky-400"; break;
                                        case 'amber': activeClass = "bg-amber-500/20 border-amber-500 text-amber-400"; break;
                                        case 'emerald': activeClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400"; break;
                                        case 'violet': activeClass = "bg-violet-500/20 border-violet-500 text-violet-400"; break;
                                        case 'orange': activeClass = "bg-orange-500/20 border-orange-500 text-orange-400"; break;
                                    }

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setRole(option.value as StaffRole)}
                                            className={`px-3 py-3 text-sm font-medium rounded-xl border transition-all text-left ${isSelected ? activeClass : inactiveClass}`}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
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
