"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Star, AlertCircle } from "lucide-react";

export function ProgressLogbook() {
    const classes = useQuery(api.teacher.getMyClasses);
    const [selectedClassId, setSelectedClassId] = useState("");
    const classDetails = useQuery(api.teacher.getClassDetails, selectedClassId ? { classId: selectedClassId as any } : "skip");
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const logProgress = useMutation(api.teacher.logProgress);

    const students = classDetails?.students || [];

    const [form, setForm] = useState({
        surahName: "",
        ayahStart: "1",
        ayahEnd: "10",
        topic: "",
        score: "",
        rating: "5",
        status: "Passed",
        notes: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId || !selectedClassId) return;

        try {
            await logProgress({
                studentId: selectedStudentId as any,
                classId: selectedClassId as any,
                // Quran fields - only send if present
                surahName: form.surahName || undefined,
                ayahStart: form.ayahStart ? parseInt(form.ayahStart) : undefined,
                ayahEnd: form.ayahEnd ? parseInt(form.ayahEnd) : undefined,
                // Academic fields
                topic: form.topic || undefined,
                score: form.score ? parseInt(form.score) : undefined,
                // Common
                rating: parseInt(form.rating),
                status: form.status,
                notes: form.notes
            });
            alert("Progress logged successfully!");
            setForm({ text: "", surahName: "", ayahStart: "1", ayahEnd: "10", topic: "", score: "", rating: "5", status: "Passed", notes: "" } as any);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Student Logbook
                </CardTitle>
                <CardDescription>Record daily Quran recitation progress.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase">Halaqa</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full mt-1 rounded-md border p-2 text-sm bg-background"
                        >
                            <option value="">Select Halaqa</option>
                            {classes?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase">Student</label>
                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="w-full mt-1 rounded-md border p-2 text-sm bg-background"
                            disabled={!selectedClassId}
                        >
                            <option value="">Select Student</option>
                            {students?.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                {selectedStudentId && (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        {/* Dynamic Form Fields based on Subject */}
                        {classDetails?.subject === "Quran" || !classDetails?.subject ? (
                            // --- QURAN FIELDS ---
                            <>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-medium text-muted-foreground">Surah Name</label>
                                        <input
                                            value={form.surahName}
                                            onChange={(e) => setForm({ ...form, surahName: e.target.value })}
                                            className="w-full mt-1 rounded-md border p-2 text-sm bg-background"
                                            placeholder="e.g. Al-Baqarah"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Rating (1-5)</label>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, rating: num.toString() })}
                                                    className={`p-1.5 rounded ${parseInt(form.rating) >= num ? 'text-amber-500' : 'text-muted-foreground'}`}
                                                >
                                                    <Star className={`h-4 w-4 ${parseInt(form.rating) >= num ? 'fill-current' : ''}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Ayah Range</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                type="number"
                                                value={form.ayahStart}
                                                onChange={(e) => setForm({ ...form, ayahStart: e.target.value })}
                                                className="w-full rounded-md border p-2 text-sm bg-background"
                                            />
                                            <span>to</span>
                                            <input
                                                type="number"
                                                value={form.ayahEnd}
                                                onChange={(e) => setForm({ ...form, ayahEnd: e.target.value })}
                                                className="w-full rounded-md border p-2 text-sm bg-background"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Status</label>
                                        <select
                                            value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                            className="w-full mt-1 rounded-md border p-2 text-sm bg-background"
                                        >
                                            <option value="Passed">Passed</option>
                                            <option value="Needs Review">Needs Review</option>
                                            <option value="Failed">Failed</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // --- GENERAL ACADEMIC FIELDS ---
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-medium text-muted-foreground">Lesson Topic / Chapter</label>
                                        <input
                                            value={form.topic}
                                            onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                            className="w-full mt-1 rounded-md border p-2 text-sm bg-background"
                                            placeholder={`e.g. ${classDetails.subject} Chapter 4`}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Grade / Score</label>
                                        <input
                                            type="number"
                                            value={form.score}
                                            onChange={(e) => setForm({ ...form, score: e.target.value })}
                                            className="w-full mt-1 rounded-md border p-2 text-sm bg-background"
                                            placeholder="e.g. 95"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Rating (1-5)</label>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, rating: num.toString() })}
                                                    className={`p-1.5 rounded ${parseInt(form.rating) >= num ? 'text-amber-500' : 'text-muted-foreground'}`}
                                                >
                                                    <Star className={`h-4 w-4 ${parseInt(form.rating) >= num ? 'fill-current' : ''}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Teacher Notes</label>
                            <textarea
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                className="w-full mt-1 rounded-md border p-2 text-sm bg-background resize-none h-20"
                                placeholder="Feedback on performance..."
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Save Progress Log
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
