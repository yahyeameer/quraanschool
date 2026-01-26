"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Loader2,
    Plus,
    Mail,
    UserPlus,
    X,
    User,
    Phone,
    Briefcase,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type StaffRole = "teacher" | "staff" | "manager" | "accountant" | "librarian" | "receptionist";

export function AddStaffModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const inviteStaff = useMutation(api.admin.inviteStaff);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState<StaffRole>("teacher");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await inviteStaff({
                email,
                name,
                phone: phone || undefined,
                role
            });
            toast.success("Divine invitation dispatched!", {
                icon: <Sparkles className="h-4 w-4 text-emerald-400" />
            });
            setName("");
            setEmail("");
            setPhone("");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to dispatch invitation");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    className="relative w-full max-w-2xl overflow-hidden bg-[#030712] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(59,130,246,0.1)] p-8 md:p-12"
                >
                    {/* Background Glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-10" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -z-10" />

                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 text-zinc-500 hover:text-white rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="flex items-center gap-6 mb-12">
                        <div className="h-16 w-16 flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                            <UserPlus className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold font-amiri text-white tracking-tight">Commission Staff</h3>
                            <p className="text-sm text-zinc-500 tracking-widest uppercase mt-1">Summon a new guardian to the institution</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-blue-500/50 text-white placeholder:text-zinc-700"
                                        placeholder="Enter scholar's name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Email Coordinate</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-blue-500/50 text-white placeholder:text-zinc-700"
                                        placeholder="official@quraan.com"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Phone Link (Optional)</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-blue-500/50 text-white placeholder:text-zinc-700"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Assigned Domain</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as StaffRole)}
                                        className="w-full pl-12 pr-4 bg-white/5 border border-white/10 h-14 rounded-2xl focus:ring-blue-500/50 text-white appearance-none outline-none cursor-pointer hover:bg-white/10 transition-all font-medium"
                                    >
                                        <option value="teacher" className="bg-[#030712] text-white">Teacher / Murshid</option>
                                        <option value="staff" className="bg-[#030712] text-white">Support Staff</option>
                                        <option value="manager" className="bg-[#030712] text-white">Domain Manager</option>
                                        <option value="accountant" className="bg-[#030712] text-white">Fiscal Officer</option>
                                        <option value="librarian" className="bg-[#030712] text-white">Keeper of Books</option>
                                        <option value="receptionist" className="bg-[#030712] text-white">Gatekeeper</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-16 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg tracking-tight shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheck className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                        Disperse Invitation
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
