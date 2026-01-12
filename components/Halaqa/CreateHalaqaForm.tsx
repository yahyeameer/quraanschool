"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Plus } from "lucide-react";

export function CreateHalaqaForm({ onSuccess }: { onSuccess: () => void }) {
    const createClass = useMutation(api.classes.create);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Hifz");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createClass({
                name,
                category,
                schedule: [{ day: "Mon", time: "17:00" }], // Default schedule for demo
            });
            setName("");
            onSuccess();
        } catch (error) {
            console.error("Failed to create class:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-amiri text-xl font-bold text-foreground">Create New Halaqa</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Class Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Surat Al-Baqarah Circle"
                        required
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="Hifz">Hifz (Memorization)</option>
                        <option value="Nazra">Nazra (Reading)</option>
                        <option value="Tajweed">Tajweed (Rules)</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Create Halaqa
                </button>
            </form>
        </div>
    );
}
