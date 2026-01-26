"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Loader2,
    TrendingUp,
    Users,
    Calendar,
    Award,
    BookOpen,
    Plus,
    Sparkles,
    LayoutGrid,
    ListChecks,
    GraduationCap,
    Globe,
    FileText,
    ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function ManagerAcademicPage() {
    const exams = useQuery(api.academic.getExams, {});
    const subjects = useQuery(api.academic.listSubjects);

    // Mutations
    const addSubject = useMutation(api.academic.addSubject);
    const addCourseItem = useMutation(api.academic.addCourseItem);

    // State
    const [activeTab, setActiveTab] = useState("overview");
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

    // Form States
    const [newSubject, setNewSubject] = useState({ name: "", code: "", category: "Academic", description: "" });
    const [newCourseItem, setNewCourseItem] = useState({
        subjectId: "",
        title: "",
        level: "Beginner",
        description: "",
        books: [{ title: "", author: "", link: "" }],
        topics: [""]
    });

    const handleAddSubject = async () => {
        try {
            await addSubject(newSubject);
            toast.success("Subject added successfully");
            setIsSubjectModalOpen(false);
            setNewSubject({ name: "", code: "", category: "Academic", description: "" });
        } catch (error) {
            toast.error("Failed to add subject");
        }
    };

    const handleAddCourseItem = async () => {
        if (!newCourseItem.subjectId) return toast.error("Please select a subject");
        try {
            await addCourseItem({
                ...newCourseItem,
                subjectId: newCourseItem.subjectId as any,
                topics: newCourseItem.topics.filter(t => t.trim() !== "")
            });
            toast.success("Course item added");
            setIsCourseModalOpen(false);
        } catch (error) {
            toast.error("Failed to add course item");
        }
    };

    if (exams === undefined || subjects === undefined) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#030712]">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-emerald-500 animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-emerald-400 animate-pulse" />
                </div>
            </div>
        );
    }

    const totalExams = exams.length;
    const completedExams = exams.filter(e => e.status === "completed").length;

    return (
        <RoleGuard requiredRole="manager">
            <div className="min-h-screen bg-[#030712] text-zinc-100 p-4 md:p-8 space-y-10 relative overflow-hidden">
                {/* Celestial Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-5xl font-bold font-amiri tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-blue-400">
                            Academic Spheres
                        </h1>
                        <p className="text-zinc-400 mt-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-500" />
                            Commanding the educational horizon and student excellence.
                        </p>
                    </motion.div>

                    <div className="flex gap-3">
                        <Dialog open={isSubjectModalOpen} onOpenChange={setIsSubjectModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-2xl h-12 px-6 backdrop-blur-xl">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Subject
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900/90 border-white/10 text-white backdrop-blur-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold font-amiri text-emerald-400">Initialize New Subject</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Subject Name</Label>
                                            <Input className="bg-white/5 border-white/10" value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} placeholder="e.g. Fiqh" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Code</Label>
                                            <Input className="bg-white/5 border-white/10" value={newSubject.code} onChange={e => setNewSubject({ ...newSubject, code: e.target.value })} placeholder="FIQ101" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={newSubject.category} onValueChange={val => setNewSubject({ ...newSubject, category: val })}>
                                            <SelectTrigger className="bg-white/5 border-white/10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-white/10 text-white">
                                                <SelectItem value="Academic">Academic</SelectItem>
                                                <SelectItem value="Quran">Quran</SelectItem>
                                                <SelectItem value="Language">Language</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea className="bg-white/5 border-white/10" value={newSubject.description} onChange={e => setNewSubject({ ...newSubject, description: e.target.value })} placeholder="Outline the essence of this subject..." />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddSubject} className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold h-12 rounded-xl">Create Sphere</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-2xl h-12 px-6 backdrop-blur-xl">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Configure Curriculum
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900/90 border-white/10 text-white backdrop-blur-2xl lg:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold font-amiri text-blue-400">Establish Course of Study</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
                                    <div className="space-y-2">
                                        <Label>Target Subject</Label>
                                        <Select value={newCourseItem.subjectId} onValueChange={val => setNewCourseItem({ ...newCourseItem, subjectId: val })}>
                                            <SelectTrigger className="bg-white/10 border-white/10">
                                                <SelectValue placeholder="Select Subject" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-white/10 text-white">
                                                {subjects.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Study Level Title</Label>
                                            <Input className="bg-white/5 border-white/10" value={newCourseItem.title} onChange={e => setNewCourseItem({ ...newCourseItem, title: e.target.value })} placeholder="e.g. Foundation Level" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Difficulty</Label>
                                            <Select value={newCourseItem.level} onValueChange={val => setNewCourseItem({ ...newCourseItem, level: val })}>
                                                <SelectTrigger className="bg-white/5 border-white/10">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-800 border-white/10 text-white">
                                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-blue-300 font-bold">Recommended Materials (Books)</Label>
                                            <Button size="sm" variant="ghost" onClick={() => setNewCourseItem({ ...newCourseItem, books: [...newCourseItem.books, { title: "", author: "", link: "" }] })}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {newCourseItem.books.map((book, idx) => (
                                            <div key={idx} className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                                                <Input className="bg-transparent border-white/10 h-8 text-xs" value={book.title} onChange={e => {
                                                    const b = [...newCourseItem.books];
                                                    b[idx].title = e.target.value;
                                                    setNewCourseItem({ ...newCourseItem, books: b });
                                                }} placeholder="Book Title" />
                                                <Input className="bg-transparent border-white/10 h-8 text-xs" value={book.author || ""} onChange={e => {
                                                    const b = [...newCourseItem.books];
                                                    b[idx].author = e.target.value;
                                                    setNewCourseItem({ ...newCourseItem, books: b });
                                                }} placeholder="Author" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddCourseItem} className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-12 rounded-xl">Seal Curriculum</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                    <TabsList className="bg-zinc-900/50 p-1 border border-white/10 backdrop-blur-xl h-14 rounded-2xl w-full md:w-auto">
                        <TabsTrigger value="overview" className="rounded-xl px-10 data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all h-full">Overview</TabsTrigger>
                        <TabsTrigger value="subjects" className="rounded-xl px-10 data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-all h-full">Spheres</TabsTrigger>
                        <TabsTrigger value="curriculum" className="rounded-xl px-10 data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all h-full">Pathways</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid gap-8">
                            {/* Stats */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <StatCard
                                    title="Celestial Exams"
                                    value={totalExams}
                                    subtitle={`${completedExams} orbital completions`}
                                    icon={Award}
                                    gradient="from-orange-500 to-amber-500"
                                />
                                <StatCard
                                    title="Active Subjects"
                                    value={subjects.length}
                                    subtitle="Established domains"
                                    icon={Globe}
                                    gradient="from-emerald-500 to-teal-500"
                                />
                                <StatCard
                                    title="Enlightenment Rate"
                                    value="--%"
                                    subtitle="School-wide average"
                                    icon={TrendingUp}
                                    gradient="from-pink-500 to-rose-500"
                                />
                                <StatCard
                                    title="Course Pathways"
                                    value="--"
                                    subtitle="Defined curriculums"
                                    icon={BookOpen}
                                    gradient="from-blue-500 to-indigo-500"
                                />
                            </div>

                            <div className="grid gap-8 md:grid-cols-2">
                                <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-white/5 border-b border-white/5 px-8 pt-6 pb-6">
                                        <CardTitle className="text-xl font-amiri tracking-widest text-emerald-400">Chronicle of Exams</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-4">
                                            {exams.length === 0 ? (
                                                <div className="text-center py-12 opacity-30 italic">No astral observations yet.</div>
                                            ) : (
                                                exams.slice(0, 5).map((exam, idx) => (
                                                    <motion.div
                                                        key={exam._id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 group transition-all"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                                                <FileText className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-zinc-100">{exam.title}</div>
                                                                <div className="text-xs text-zinc-500">{exam.subject} • {format(new Date(exam.date), 'MMM d, yyyy')}</div>
                                                            </div>
                                                        </div>
                                                        <div className={`text-[10px] font-bold tracking-widest px-3 py-1 rounded-lg border uppercase ${exam.status === 'completed'
                                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                            : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                                            }`}>
                                                            {exam.status}
                                                        </div>
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-white/5 border-b border-white/5 px-8 pt-6 pb-6">
                                        <CardTitle className="text-xl font-amiri tracking-widest text-blue-400">Attendance Constellation</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[350px] flex items-center justify-center relative">
                                        <div className="text-center z-10">
                                            <Calendar className="h-16 w-16 mx-auto mb-4 text-zinc-700 animate-pulse" />
                                            <p className="text-zinc-500 font-medium">Observing class alignment...</p>
                                        </div>
                                        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent)]" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="subjects">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {subjects.map((sub, idx) => (
                                <motion.div
                                    key={sub._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card className="bg-zinc-900/60 border-white/10 hover:border-teal-500/50 transition-all group h-full backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl">
                                        <CardHeader className="space-y-1 p-6 relative">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                                <div className="h-20 w-20 rounded-full border border-teal-500/20 flex items-center justify-center text-teal-400">
                                                    <Sparkles className="h-8 w-8" />
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-bold text-teal-400/80 tracking-widest uppercase">{sub.category}</div>
                                            <CardTitle className="text-2xl font-bold font-amiri">{sub.name}</CardTitle>
                                            <div className="text-xs text-zinc-500 font-mono">{sub.code}</div>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-0">
                                            <p className="text-sm text-zinc-400 leading-relaxed mb-6 italic min-h-[3rem]">
                                                {sub.description || "Divine knowledge unfolds within this sphere."}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-[#030712] bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                                                            T
                                                            <div className="absolute inset-0 rounded-full bg-teal-500/10" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button variant="ghost" className="text-xs text-zinc-500 py-0 h-auto hover:text-teal-400">
                                                    Manage Access
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                            <button
                                onClick={() => setIsSubjectModalOpen(true)}
                                className="group relative border border-dashed border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-4 text-zinc-500 hover:text-emerald-400"
                            >
                                <div className="h-16 w-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:scale-110 transition-all">
                                    <Plus className="h-8 w-8" />
                                </div>
                                <span className="font-bold tracking-widest text-xs uppercase">Expand Universe</span>
                            </button>
                        </div>
                    </TabsContent>

                    <TabsContent value="curriculum">
                        <div className="space-y-8">
                            {subjects.length === 0 && (
                                <div className="text-center py-20 opacity-30">Define spheres before establishing pathways.</div>
                            )}
                            {subjects.map((sub) => (
                                <SubjectPathway key={sub._id} subject={sub} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    );
}

function SubjectPathway({ subject }: { subject: any }) {
    const courseOfStudy = useQuery(api.academic.getCourseOfStudy, { subjectId: subject._id });

    return (
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5 px-8 py-6 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-amiri tracking-[0.2em] text-blue-400 uppercase">{subject.name}</CardTitle>
                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Educational Trajectory • {subject.code}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <GraduationCap className="h-6 w-6" />
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    {courseOfStudy?.length === 0 ? (
                        <div className="lg:col-span-2 py-10 text-center border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                            <Sparkles className="h-8 w-8 text-blue-500" />
                            <p className="text-sm italic">Curriculum awaiting architect. Set coordinates above.</p>
                        </div>
                    ) : (
                        courseOfStudy?.map((item) => (
                            <div key={item._id} className="bg-black/40 border border-white/5 rounded-3xl p-6 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10" />
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-xl font-bold text-blue-100">{item.title}</h4>
                                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{item.level}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-[10px] font-bold border-blue-500/20 text-blue-400">SYLLABUS</Badge>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-2">
                                            <div className="h-[1px] w-4 bg-zinc-800" />
                                            Required Texts
                                        </div>
                                        <div className="grid gap-2">
                                            {item.books.map((book, bidx) => (
                                                <div key={bidx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group/book">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="h-4 w-4 text-blue-400 opacity-50 group-hover/book:opacity-100" />
                                                        <div>
                                                            <div className="text-sm font-medium text-zinc-200">{book.title}</div>
                                                            <div className="text-[10px] text-zinc-500">{book.author}</div>
                                                        </div>
                                                    </div>
                                                    {book.link && (
                                                        <a href={book.link} target="_blank" className="text-blue-500 hover:text-blue-400 opacity-0 group-hover/book:opacity-100 transition-all">
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-2">
                                            <div className="h-[1px] w-4 bg-zinc-800" />
                                            Core Topics
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.topics.map((topic, tidx) => (
                                                <span key={tidx} className="text-[10px] px-3 py-1 bg-blue-500/5 text-blue-400 rounded-full border border-blue-500/10">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, gradient }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="relative"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 blur-2xl rounded-[2rem]`} />
            <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden h-full relative z-10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                    <CardTitle className="text-xs font-bold tracking-widest text-zinc-500 uppercase">{title}</CardTitle>
                    <div className={`p-2 rounded-xl bg-white/5 text-zinc-200`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="text-4xl font-bold tracking-tighter text-white mb-1">{value}</div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{subtitle}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function Badge({ children, variant = "default", className }: any) {
    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${className}`}>
            {children}
        </span>
    );
}
