"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreateHalaqaForm } from "@/components/Halaqa/CreateHalaqaForm";
import { HalaqaCard } from "@/components/Halaqa/HalaqaCard";
import { Plus } from "lucide-react";

export default function HalaqaPage() {
    const user = useQuery(api.users.currentUser);
    // If teacher, show only their classes. If admin/manager query all. If student... they probably shouldn't see 'all' but for now list all or filtered
    // Assuming 'list' returns all.
    // Better logic:
    const allClasses = useQuery(api.classes.list);
    const teacherClasses = useQuery(api.classes.getTeacherClasses);

    // Choose which list to show based on role
    const classes = user?.role === "teacher" ? teacherClasses : allClasses;

    const [showForm, setShowForm] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-amiri text-3xl font-bold text-foreground">Class Management</h1>
                    <p className="text-muted-foreground">Manage your educational circles and assignments.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" />
                    {showForm ? "Cancel" : "New Class"}
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Create Form Column (conditionally shown or as a side panel in future) */}
                {showForm && (
                    <div className="lg:col-span-1">
                        <CreateHalaqaForm onSuccess={() => setShowForm(false)} />
                    </div>
                )}

                {/* List Column */}
                <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
                    {classes === undefined ? (
                        <div className="flex h-40 items-center justify-center text-muted-foreground">Loading...</div>
                    ) : classes.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">
                            <p>No Classes found.</p>
                            <p className="text-sm">Create one to get started.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {classes.map((cls) => (
                                <HalaqaCard key={cls._id} data={cls} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
