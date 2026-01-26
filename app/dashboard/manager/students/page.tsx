"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { AddStudentModal } from "@/components/Students/AddStudentModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    UserPlus,
    Phone,
    MessageCircle,
    Mail,
    MapPin,
    MoreHorizontal,
    GraduationCap,
    Clock,
    Sparkles,
    User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ManagerStudentsPage() {
    const studentsData = useQuery(api.students.listEnrolled);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter Logic
    const filteredStudents = studentsData?.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.parentName?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const getWhatsAppLink = (phone: string | undefined, name: string) => {
        if (!phone) return "#";
        const cleanPhone = phone.replace(/\D/g, '');
        return `https://wa.me/${cleanPhone}?text=As-salamu alaykum, parent of ${name}.`;
    };

    return (
        <RoleGuard requiredRole={["manager", "staff"]}>
            <div className="space-y-8 p-4 md:p-8 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold font-amiri tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
                            Student Directory
                        </h1>
                        <p className="text-muted-foreground mt-2">Manage enrollment, contact parents, and track progress.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-full md:w-[300px] bg-white/5 border-white/10 rounded-xl focus:ring-emerald-500/50 h-12"
                            />
                        </div>
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                        >
                            <UserPlus className="h-5 w-5 mr-2" />
                            Add Student
                        </Button>
                    </div>
                </div>

                {/* Interactive Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence>
                        {filteredStudents.map((student, idx) => (
                            <motion.div
                                key={student._id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 h-full flex flex-col p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl overflow-hidden">
                                    {/* Header Info */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-400 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center shadow-inner border border-white/10 overflow-hidden relative">
                                                {student.avatarUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={student.avatarUrl} alt={student.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <User className="h-6 w-6 text-white/50" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight group-hover:text-emerald-400 transition-colors">{student.name}</h3>
                                                <Badge variant="outline" className="mt-1 border-emerald-500/30 text-emerald-500 bg-emerald-500/10 text-[10px] uppercase font-bold tracking-wider">
                                                    Active Student
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Parent/Contact Info */}
                                    {student.parentId ? (
                                        <div className="space-y-3 mb-6 bg-black/20 rounded-xl p-3 border border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                                    <User className="h-3 w-3 text-blue-400" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Guardian</p>
                                                    <p className="text-sm font-medium truncate">{student.parentName || "Unknown"}</p>
                                                </div>
                                            </div>
                                            {(student.parentPhone || student.phone) && (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                                                        <Phone className="h-3 w-3 text-violet-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Mobile</p>
                                                        <p className="text-sm font-medium">{student.parentPhone || student.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-6">
                                            <p className="text-xs text-orange-400 flex items-center gap-2">
                                                <Sparkles className="h-3 w-3" />
                                                Parent not linked
                                            </p>
                                        </div>
                                    )}

                                    {/* Quick Actions */}
                                    <div className="mt-auto grid grid-cols-3 gap-2">
                                        <a
                                            href={getWhatsAppLink(student.parentPhone || student.phone, student.name)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors group/btn"
                                            title="WhatsApp"
                                        >
                                            <MessageCircle className="h-5 w-5 mb-1" />
                                            <span className="text-[10px] font-medium opacity-60 group-hover/btn:opacity-100">Chat</span>
                                        </a>
                                        <a
                                            href={`tel:${student.parentPhone || student.phone}`}
                                            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-violet-500/20 hover:text-violet-400 transition-colors group/btn"
                                            title="Call"
                                        >
                                            <Phone className="h-5 w-5 mb-1" />
                                            <span className="text-[10px] font-medium opacity-60 group-hover/btn:opacity-100">Call</span>
                                        </a>
                                        <Link
                                            href={`/dashboard/manager/students/${student._id}`}
                                            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition-colors group/btn cursor-pointer"
                                        >
                                            <GraduationCap className="h-5 w-5 mb-1" />
                                            <span className="text-[10px] font-medium opacity-60 group-hover/btn:opacity-100">Profile</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {studentsData?.length === 0 && (
                        <div className="col-span-full py-20 text-center text-muted-foreground">
                            <p>No students enrolled yet.</p>
                        </div>
                    )}
                </div>

                <AddStudentModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                />
            </div>
        </RoleGuard>
    );
}
