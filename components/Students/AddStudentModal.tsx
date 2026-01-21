"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, UserPlus, X, Phone, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddStudentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const inviteStudent = useMutation(api.admin.inviteStudent);
    const [studentName, setStudentName] = useState("");
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await inviteStudent({ studentName, phone });
            toast.success("Student invitation created successfully!");
            setStudentName("");
            setPhone("");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to create invitation");
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
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
                            <UserPlus className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Add New Student</h3>
                            <p className="text-xs text-zinc-400">Invite a student via phone number</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-400">Student Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                <Input
                                    id="name"
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="pl-10 bg-black/40 border-white/10"
                                    placeholder="e.g. Ahmed Ali"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-zinc-400">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-10 bg-black/40 border-white/10"
                                    placeholder="e.g. +252 61 1234567"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-zinc-500">Format: +252... or local format. Used for login.</p>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Create Invitation"
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
