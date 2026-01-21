"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Plus, Loader2, Save, FileText, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function TeacherExamsPage() {
    // --- State for Creating Exam ---
    const [createForm, setCreateForm] = useState({
        title: "",
        subject: "",
        date: "",
        totalMarks: "100",
        description: "",
        classId: ""
    });

    // --- State for Grading ---
    const [selectedExamId, setSelectedExamId] = useState<string>("");
    const [grades, setGrades] = useState<Record<string, string>>({}); // studentId -> marks

    // --- Queries & Mutations ---
    const classes = useQuery(api.classes.list) || [];
    const exams = useQuery(api.academic.getExams, { classId: createForm.classId ? createForm.classId as any : undefined });
    const createExam = useMutation(api.academic.createExam);
    const submitResults = useMutation(api.academic.submitExamResults);

    // Fetch students for grading
    const selectedExam = (exams || []).find(e => e._id === selectedExamId);
    const studentsForGrading = useQuery(api.classes.getStudents,
        selectedExam ? { classId: selectedExam.classId } : "skip"
    );

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.classId) return toast.error("Select a class");

        try {
            await createExam({
                classId: createForm.classId as any,
                title: createForm.title,
                subject: createForm.subject,
                date: createForm.date,
                totalMarks: parseFloat(createForm.totalMarks),
                description: createForm.description
            });
            toast.success("Exam scheduled successfully!");
            setCreateForm({ ...createForm, title: "", description: "" });
        } catch (error: any) {
            toast.error("Failed to create exam");
        }
    };

    const handleGradeSubmit = async () => {
        if (!selectedExamId || !studentsForGrading) return;

        const results = studentsForGrading.map(s => ({
            studentId: s._id,
            marksObtained: parseFloat(grades[s._id] || "0"),
            notes: "" // Optional notes field could be added
        }));

        try {
            await submitResults({
                examId: selectedExamId as any,
                results
            });
            toast.success("Grades submitted successfully!");
        } catch (error: any) {
            toast.error("Failed to submit grades");
        }
    };

    return (
        <RoleGuard requiredRole="teacher">
            <div className="space-y-8">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent italic">
                        Exam Management
                    </h2>
                    <p className="text-muted-foreground mt-1">Schedule assessments and record student results.</p>
                </div>

                <Tabs defaultValue="schedule" className="space-y-6">
                    <TabsList className="bg-black/20 border border-white/10 p-1">
                        <TabsTrigger value="schedule" className="data-[state=active]:bg-primary">Schedule Exaam</TabsTrigger>
                        <TabsTrigger value="grade" className="data-[state=active]:bg-primary">Grade Results</TabsTrigger>
                    </TabsList>

                    {/* --- TAB 1: SCHEDULE EXAM --- */}
                    <TabsContent value="schedule">
                        <Card className="glass-panel border-white/5 max-w-2xl">
                            <CardHeader>
                                <CardTitle>Create New Assessment</CardTitle>
                                <CardDescription>Schedule a new exam or quiz for your class.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateExam} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Class</Label>
                                            <Select
                                                onValueChange={(val) => setCreateForm({ ...createForm, classId: val })}
                                                value={createForm.classId}
                                            >
                                                <SelectTrigger className="bg-black/40 border-white/10"><SelectValue placeholder="Select Class" /></SelectTrigger>
                                                <SelectContent>
                                                    {classes.map((c: any) => (
                                                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Date</Label>
                                            <Input
                                                type="date"
                                                value={createForm.date}
                                                onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                                                className="bg-black/40 border-white/10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                placeholder="e.g. Surah Al-Mulk Quiz"
                                                value={createForm.title}
                                                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                                className="bg-black/40 border-white/10"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Subject</Label>
                                            <Input
                                                placeholder="e.g. Hifz"
                                                value={createForm.subject}
                                                onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                                                className="bg-black/40 border-white/10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Total Marks</Label>
                                        <Input
                                            type="number"
                                            value={createForm.totalMarks}
                                            onChange={(e) => setCreateForm({ ...createForm, totalMarks: e.target.value })}
                                            className="bg-black/40 border-white/10"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Description (Optional)</Label>
                                        <Textarea
                                            placeholder="Topics covered..."
                                            value={createForm.description}
                                            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                            className="bg-black/40 border-white/10"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-primary font-bold">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Schedule Exam
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB 2: GRADE RESULTS --- */}
                    <TabsContent value="grade">
                        <div className="grid gap-6 md:grid-cols-1">
                            {/* Exam Selector */}
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <Label className="block mb-2 text-xs font-bold uppercase text-muted-foreground">Select Exam to Grade</Label>
                                <Select onValueChange={setSelectedExamId}>
                                    <SelectTrigger className="bg-black/40 border-white/10 w-full md:w-[400px]">
                                        <SelectValue placeholder="Choose an assessment..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="placeholder" disabled>Select an exam</SelectItem>
                                        {/* Ideally fetch ALL exams for teacher, assuming 'exams' query handles it */}
                                        {exams?.map((exam: any) => (
                                            <SelectItem key={exam._id} value={exam._id}>
                                                {exam.title} - {format(new Date(exam.date), 'MMM d')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedExamId && studentsForGrading && (
                                <Card className="glass-panel border-white/5">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>Grading: {selectedExam?.title}</span>
                                            <span className="text-sm font-normal text-muted-foreground">Max Marks: {selectedExam?.totalMarks}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md border border-white/10 overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-white/5 text-muted-foreground">
                                                    <tr>
                                                        <th className="h-12 px-4 text-left font-medium">Student</th>
                                                        <th className="h-12 px-4 text-right font-medium">Marks Obtained</th>
                                                        {/* <th className="h-12 px-4 text-left font-medium">Notes</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {studentsForGrading.map((student: any) => (
                                                        <tr key={student._id} className="border-t border-white/5 hover:bg-white/5">
                                                            <td className="p-4 font-medium flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-bold">
                                                                    {student.name[0]}
                                                                </div>
                                                                {student.name}
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <Input
                                                                    type="number"
                                                                    className="w-24 ml-auto bg-black/40 border-white/10 text-right"
                                                                    placeholder="0"
                                                                    value={grades[student._id] || ""}
                                                                    onChange={(e) => setGrades({ ...grades, [student._id]: e.target.value })}
                                                                    max={selectedExam?.totalMarks}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <Button onClick={handleGradeSubmit} className="bg-green-600 hover:bg-green-700 text-white font-bold px-8">
                                                <Save className="h-4 w-4 mr-2" />
                                                Submit All Grades
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    );
}
