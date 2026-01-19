"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, FileText, Loader2 } from "lucide-react";

export function AssignmentManager() {
    const classes = useQuery(api.teacher.getMyClasses);
    const [selectedClassId, setSelectedClassId] = useState("");
    const createAssignment = useMutation(api.assignments.create);
    const assignments = useQuery(api.assignments.listByClass, selectedClassId ? { classId: selectedClassId as any } : "skip");

    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClassId) return;
        try {
            await createAssignment({
                classId: selectedClassId as any,
                title: form.title,
                description: form.description,
                dueDate: form.dueDate
            });
            alert("Assignment created!");
            setForm({ title: "", description: "", dueDate: new Date().toISOString().split('T')[0] });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Homework & Assignments
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Create side */}
                    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-accent/10 p-4">
                        <h4 className="font-bold text-sm uppercase text-muted-foreground">New Assignment</h4>
                        <div>
                            <label className="text-xs font-medium">Target Halaqa</label>
                            <select
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                className="w-full mt-1 rounded border p-2 text-sm bg-background"
                                required
                            >
                                <option value="">Select Halaqa</option>
                                {classes?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium">Title</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full mt-1 rounded border p-2 text-sm bg-background"
                                placeholder="e.g. Memorize Surah Al-Kahf 1-10"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Due Date</label>
                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                className="w-full mt-1 rounded border p-2 text-sm bg-background"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={!selectedClassId}>
                            Post Assignment
                        </Button>
                    </form>

                    {/* View side */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="font-bold text-sm uppercase text-muted-foreground">Active Assignments</h4>
                        <div className="space-y-3">
                            {selectedClassId ? (
                                assignments?.map((a) => (
                                    <div key={a._id} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-primary/10 p-2">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{a.title}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                                            ACTIVE
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-muted-foreground border border-dashed rounded-xl text-sm">
                                    Select a class to view its assignments.
                                </div>
                            )}
                            {selectedClassId && assignments?.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground border border-dashed rounded-xl text-sm">
                                    No assignments for this class yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
