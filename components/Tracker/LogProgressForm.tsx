"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Save, Star } from "lucide-react";

const SURAHS = [
    "Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah",
    "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
    "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh" // Truncated list for demo
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
            setFormData(prev => ({ ...prev, notes: "", rating: 5 })); // Reset some fields
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to log:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-amiri text-xl font-bold text-foreground">Log Progress</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-muted-foreground">Surah</label>
                        <select
                            className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                            value={formData.surahName}
                            onChange={e => setFormData({ ...formData, surahName: e.target.value })}
                        >
                            {SURAHS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-muted-foreground">Type</label>
                        <div className="flex rounded-md bg-accent/50 p-1">
                            {['hifz', 'review'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`flex-1 rounded px-3 py-1 text-xs font-medium capitalize transition-all ${formData.type === type
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-background/50"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="mb-1 block text-sm font-medium text-muted-foreground">Ayah Start</label>
                        <input
                            type="number"
                            min={1}
                            className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                            value={formData.ayahStart}
                            onChange={e => setFormData({ ...formData, ayahStart: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="mb-1 block text-sm font-medium text-muted-foreground">Ayah End</label>
                        <input
                            type="number"
                            min={1}
                            className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                            value={formData.ayahEnd}
                            onChange={e => setFormData({ ...formData, ayahEnd: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">Self Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: star })}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`h-6 w-6 transition-all ${star <= formData.rating ? "fill-amber-400 text-amber-400" : "text-border"}`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Entry
                </button>
            </form>
        </div>
    );
}
