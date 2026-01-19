import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Plus, Sparkles, User, Book, Layers, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CreateHalaqaForm({ onSuccess }: { onSuccess: () => void }) {
    const user = useQuery(api.users.currentUser);
    const isAdminOrManager = user?.role === "admin" || user?.role === "manager";

    // Only fetch users if authorized to avoid "application error" for teachers
    const users = useQuery(api.admin.listUsers, isAdminOrManager ? {} : "skip");
    const createClass = useMutation(api.classes.create);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("Hifz");
    const [subject, setSubject] = useState("Quran");
    const [teacherId, setTeacherId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const teachers = users?.filter((u: any) => u.role === "teacher") || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createClass({
                name,
                category,
                subject,
                schedule: [{ day: "Mon", time: "17:00" }],
                teacherId: teacherId ? teacherId as any : undefined,
            });
            toast.success("Halaqa created successfully!", {
                icon: <Sparkles className="h-4 w-4 text-emerald-500" />
            });
            setName("");
            onSuccess();
        } catch (error) {
            console.error("Failed to create class:", error);
            toast.error("Failed to create halaqa. Check permissions.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return (
        <div className="flex items-center justify-center p-8 bg-zinc-900/50 rounded-2xl border border-white/5">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-background/50 backdrop-blur-xl p-6 shadow-2xl ring-1 ring-white/5 overflow-hidden relative"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />

            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Plus className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-amiri text-2xl font-bold text-emerald-50 tracking-tight">Birth a New Halaqa</h3>
                    <p className="text-xs text-muted-foreground">Define the boundaries of a new learning sanctuary</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold text-emerald-500/60 uppercase tracking-widest ml-1">
                        <Info className="h-3 w-3" />
                        Sanctuary Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-2xl border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:ring-emerald-500/50 outline-none ring-1 ring-white/5 transition-all focus:bg-black/60"
                        placeholder="e.g. Al-Baqarah Morning Circle"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-bold text-emerald-500/60 uppercase tracking-widest ml-1">
                            <Book className="h-3 w-3" />
                            Sacred Subject
                        </label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full rounded-2xl border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:ring-emerald-500/50 outline-none ring-1 ring-white/5 appearance-none cursor-pointer hover:bg-black/60 transition-colors"
                        >
                            <option value="Quran" className="bg-zinc-900">Quran</option>
                            <option value="Islamic Studies" className="bg-zinc-900">Islamic Studies</option>
                            <option value="Arabic" className="bg-zinc-900">Arabic</option>
                            <option value="Hadeeth" className="bg-zinc-900">Hadeeth</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-bold text-emerald-500/60 uppercase tracking-widest ml-1">
                            <Layers className="h-3 w-3" />
                            Insight Level
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-2xl border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:ring-emerald-500/50 outline-none ring-1 ring-white/5 appearance-none cursor-pointer hover:bg-black/60 transition-colors"
                        >
                            <option value="Hifz" className="bg-zinc-900">Hifz / Advanced</option>
                            <option value="Nazra" className="bg-zinc-900">Nazra / Intermediate</option>
                            <option value="Tajweed" className="bg-zinc-900">Tajweed / Foundation</option>
                        </select>
                    </div>
                </div>

                <AnimatePresence>
                    {isAdminOrManager && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1.5 overflow-hidden"
                        >
                            <label className="flex items-center gap-2 text-xs font-bold text-sky-500/60 uppercase tracking-widest ml-1">
                                <User className="h-3 w-3" />
                                Shepherded By
                            </label>
                            <select
                                value={teacherId}
                                onChange={(e) => setTeacherId(e.target.value)}
                                className="w-full rounded-2xl border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:ring-sky-500/50 outline-none ring-1 ring-white/5 cursor-pointer appearance-none hover:bg-black/60 transition-colors"
                            >
                                <option value="" className="bg-zinc-900">Select Teacher (Optional)</option>
                                {teachers.map((t) => (
                                    <option key={t._id} value={t._id} className="bg-zinc-900">{t.name}</option>
                                ))}
                            </select>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                                <span>Create Sanctuary</span>
                                <Sparkles className="ml-1 h-4 w-4 opacity-10 group-hover:opacity-100 transition-opacity" />
                            </>
                        )}
                    </div>
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </button>
            </form>
        </motion.div>
    );
}
