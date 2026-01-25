"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Save, Star, BookOpen, Bookmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SURAHS = [
    "Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah",
    "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
    "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh"
];

export function LogProgressForm({ onSuccess }: { onSuccess?: () => void }) {
    const logProgress = useMutation(api.tracker.logProgress);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        surahName: "Al-Fatiha",
        ayahStart: 1,
        ayahEnd: 7,
        rating: 5,
        notes: "",
        type: "review"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await logProgress({
                ...formData,
                ayahStart: Number(formData.ayahStart),
                ayahEnd: Number(formData.ayahEnd),
            });
            setFormData(prev => ({ ...prev, notes: "", rating: 5 }));
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to log:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-8 rounded-[32px]">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-amiri text-2xl font-bold text-foreground">Log Progress</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Surah</label>
                        <select
                            className="w-full h-12 rounded-xl bg-accent/30 border-transparent focus:border-emerald-500 focus:bg-background focus:ring-0 transition-all px-4 font-medium"
                            value={formData.surahName}
                            onChange={e => setFormData({ ...formData, surahName: e.target.value })}
                        >
                            {SURAHS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Type</label>
                        <div className="flex rounded-xl bg-accent/30 p-1 h-12 items-center">
                            {['hifz', 'review'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={cn(
                                        "flex-1 h-10 rounded-lg text-sm font-bold capitalize transition-all",
                                        formData.type === type
                                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                                            : "text-muted-foreground hover:bg-white/10"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">From Ayah</label>
                        <input
                            type="number"
                            min={1}
                            className="w-full h-12 rounded-xl bg-accent/30 border-transparent focus:border-emerald-500 focus:bg-background transition-all px-4 font-bold text-lg"
                            value={formData.ayahStart}
                            onChange={e => setFormData({ ...formData, ayahStart: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">To Ayah</label>
                        <input
                            type="number"
                            min={1}
                            className="w-full h-12 rounded-xl bg-accent/30 border-transparent focus:border-emerald-500 focus:bg-background transition-all px-4 font-bold text-lg"
                            value={formData.ayahEnd}
                            onChange={e => setFormData({ ...formData, ayahEnd: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Self Rating</label>
                    <div className="flex gap-2 p-2 rounded-xl bg-accent/10 w-fit">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: star })}
                                className="focus:outline-none group"
                            >
                                <Star
                                    className={cn(
                                        "h-8 w-8 transition-all duration-300",
                                        star <= formData.rating
                                            ? "fill-amber-400 text-amber-400 drop-shadow-md scale-110"
                                            : "text-muted-foreground/30 group-hover:text-amber-400/50"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                        <>
                            <Save className="h-5 w-5" />
                            <span>Save Entry</span>
                            <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
