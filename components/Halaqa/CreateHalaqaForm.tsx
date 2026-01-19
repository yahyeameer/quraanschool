"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Plus } from "lucide-react";

export function CreateHalaqaForm({ onSuccess }: { onSuccess: () => void }) {
    const createClass = useMutation(api.classes.create);
    const users = useQuery(api.admin.listUsers);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Hifz");
    const [subject, setSubject] = useState("Quran"); // Defaults to Quran
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
                subject, // Pass subject
                schedule: [{ day: "Mon", time: "17:00" }], // Default schedule for demo
                teacherId: teacherId ? teacherId as any : undefined,
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
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Subject</label>
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary mb-4"
                    >
                        <option value="Quran">Quran</option>
                        <option value="Islamic Studies">Islamic Studies</option>
                        <option value="Hadeeth">Hadeeth</option>
                        <option value="Fiqh">Fiqh</option>
                        <option value="Seerah">Seerah</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Math">Math</option>
                        <option value="Science">Science</option>
                    </select>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Category (Level)</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="Hifz">Hifz / High</option>
                        <option value="Nazra">Nazra / Mid</option>
                        <option value="Tajweed">Tajweed / Foundation</option>
                    </select>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Assign Teacher (Optional)</label>
                    <select
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Select a teacher</option>
                        {teachers.map((t) => (
                            <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
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
