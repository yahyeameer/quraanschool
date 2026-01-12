"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreateAssignmentForm } from "@/components/Assignments/CreateAssignmentForm";
import { AssignmentCard } from "@/components/Assignments/AssignmentCard";
import { Plus } from "lucide-react";

export default function AssignmentsPage() {
    const assignments = useQuery(api.assignments.listAll);
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-amiri text-3xl font-bold text-foreground">Assignments</h1>
                    <p className="text-muted-foreground">Track pending tasks and new memorization goals.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" />
                    {showForm ? "Cancel" : "New Assignment"}
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Create Form Column */}
                {showForm && (
                    <div className="lg:col-span-1">
                        <CreateAssignmentForm onSuccess={() => setShowForm(false)} />
                    </div>
                )}

                {/* List Column */}
                <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
                    {assignments === undefined ? (
                        <div className="flex h-40 items-center justify-center text-muted-foreground">Loading...</div>
                    ) : assignments.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">
                            <p>No active assignments.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {assignments.map((a) => (
                                <AssignmentCard key={a._id} data={a} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
