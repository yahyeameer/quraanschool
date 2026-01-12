"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Plus } from "lucide-react";

export function CreateAssignmentForm({ onSuccess }: { onSuccess?: () => void }) {
    const createAssignment = useMutation(api.assignments.create);
    const classes = useQuery(api.classes.list);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        classId: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.classId) return alert("Please select a class");

        setLoading(true);
        try {
            // @ts-expect-error - ID casting
            await createAssignment({
                // @ts-expect-error - ID casting
                classId: formData.classId,
                title: formData.title,
                description: formData.description,
                dueDate: formData.dueDate,
            });
            setFormData({ title: "", description: "", dueDate: "", classId: "" });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to create assignment:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!classes) return null;

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-amiri text-xl font-bold text-foreground">New Assignment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">Class</label>
                    <select
                        className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                        value={formData.classId}
                        onChange={e => setFormData({ ...formData, classId: e.target.value })}
                        required
                    >
                        <option value="">Select a Halaqa</option>
                        {classes.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">Title</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                        placeholder="e.g. Surah Al-Mulk Memorization"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">Due Date</label>
                    <input
                        type="date"
                        className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                        value={formData.dueDate}
                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">Details</label>
                    <textarea
                        className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                        placeholder="Specific Instructions..."
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Assign Task
                </button>
            </form>
        </div>
    );
}
