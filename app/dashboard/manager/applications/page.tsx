"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Loader2,
    Phone,
    Mail,
    CheckCircle,
    Archive,
    Eye,
    MessageCircle,
    Calendar,
    User,
    Users,
    Sparkles,
    X,
    ArrowUpRight,
    Zap,
    Globe,
    ExternalLink,
    GraduationCap,
    School
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ApplicationsPage() {
    const applications = useQuery(api.registrations.list);
    const updateStatus = useMutation(api.registrations.updateStatus);
    const confirmEnrollment = useMutation(api.registrations.confirmEnrollment);

    // State
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const handleEnrollment = async (id: Id<"registrations">, role: string) => {
        try {
            await confirmEnrollment({ id, role });
            toast.success(`Applicant enrolled as ${role}`, {
                icon: <Sparkles className="h-4 w-4 text-emerald-500" />
            });
            setSelectedApp(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to enroll applicant");
        }
    };

    const handleStatusUpdate = async (id: Id<"registrations">, status: string) => {
        try {
            await updateStatus({ id, status });
            toast.success(`Application marked as ${status}`, {
                icon: <Sparkles className="h-4 w-4 text-emerald-500" />
            });
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getWhatsAppLink = (phone: string, studentName: string, parentName: string) => {
        const message = `As-salamu alaykum ${parentName},\n\nThank you for enrolling ${studentName} at Khalaf al Cudul. We're excited to begin this sacred journey of knowledge together.\n\nBest regards,\nKhalaf al Cudul Team`;
        return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    };

    const getEmailLink = (email: string, studentName: string) => {
        const subject = `Welcome to Khalaf al Cudul - ${studentName}'s Enrollment`;
        const body = `As-salamu alaykum,\n\nThank you for choosing Khalaf al Cudul for ${studentName}'s Islamic education. We are honored to be part of this blessed journey.\n\nOur team will be in touch shortly with next steps.\n\nJazakAllah Khair,\nKhalaf al Cudul Team`;
        return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    if (applications === undefined) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#030712]">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-emerald-500 animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-emerald-400 animate-pulse" />
                </div>
            </div>
        );
    }

    const filteredApps = filterStatus === "all" ? applications : applications.filter(a => a.status === filterStatus);

    return (
        <div className="min-h-screen bg-[#030712] text-zinc-100 p-4 md:p-8 space-y-10 relative overflow-hidden">
            {/* Celestial Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] -z-10" />

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-5xl font-bold font-amiri tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-sky-200 to-indigo-400">
                        Enrollment Sphere
                    </h1>
                    <p className="text-zinc-400 mt-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-500" />
                        Welcoming the next generation of scholars and guardians.
                    </p>
                </motion.div>

                <div className="flex gap-2 p-1 bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-xl shrink-0">
                    {["all", "new", "contacted", "enrolled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={cn(
                                "px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                                filterStatus === status
                                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Performance Stats */}
            <div className="grid gap-6 md:grid-cols-4">
                <StatCard
                    label="Nova Arrivals"
                    value={applications.filter(a => a.status === "new").length}
                    subtitle="Awaiting first contact"
                    color="text-sky-400"
                    icon={Zap}
                />
                <StatCard
                    label="In Alignment"
                    value={applications.filter(a => a.status === "contacted").length}
                    subtitle="Engaged applicants"
                    color="text-amber-400"
                    icon={Globe}
                />
                <StatCard
                    label="Manifested"
                    value={applications.filter(a => a.status === "enrolled").length}
                    subtitle="Fully admitted"
                    color="text-emerald-400"
                    icon={CheckCircle}
                />
                <StatCard
                    label="Total Volume"
                    value={applications.length}
                    subtitle="Overall applications"
                    color="text-indigo-400"
                    icon={School}
                />
            </div>

            {/* Applications Grid */}
            {filteredApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-24 border border-dashed border-white/10 rounded-[3rem] bg-zinc-900/20 backdrop-blur-3xl text-center">
                    <Users className="h-16 w-16 text-zinc-800 mb-6" />
                    <h3 className="font-bold text-2xl font-amiri text-zinc-500">No applicants in this segment</h3>
                    <p className="text-zinc-600 mt-2 max-w-sm">The celestial records are empty for this specific segment of our universe.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredApps.map((app, idx) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative bg-zinc-900/40 hover:bg-zinc-900/60 border border-white/5 hover:border-emerald-500/30 rounded-[2.5rem] p-6 backdrop-blur-3xl transition-all shadow-2xl overflow-hidden"
                        >
                            {/* Decorative Blur */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex justify-between items-start mb-6">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
                                    <User className="h-7 w-7 text-emerald-400" />
                                </div>
                                <StatusBadge status={app.status} />
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="text-2xl font-bold font-amiri tracking-tight group-hover:text-emerald-400 transition-colors">{app.studentName}</h3>
                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest flex items-center gap-2">
                                    {app.age} Solar Years • {app.plan}
                                </p>
                                <p className="text-[10px] text-zinc-600 font-mono mt-1">
                                    Submitted {format(new Date(app.submittedAt), "MMM d, yyyy")}
                                </p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Guardian of Profile</span>
                                    <span className="text-sm font-medium text-zinc-300">{app.parentName}</span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <ContactButton
                                        icon={MessageCircle}
                                        label="WhatsApp"
                                        link={getWhatsAppLink(app.phone, app.studentName, app.parentName)}
                                        color="text-emerald-400 hover:bg-emerald-400/10"
                                    />
                                    <ContactButton
                                        icon={Mail}
                                        label="Email"
                                        link={getEmailLink(app.email, app.studentName)}
                                        color="text-sky-400 hover:bg-sky-400/10"
                                    />
                                    <ContactButton
                                        icon={Phone}
                                        label="Call"
                                        link={`tel:${app.phone}`}
                                        color="text-indigo-400 hover:bg-indigo-400/10"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex flex-col gap-3">
                                <Button
                                    onClick={() => setSelectedApp(app)}
                                    variant="ghost"
                                    className="w-full h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold tracking-widest text-[10px] uppercase border border-white/5"
                                >
                                    Detailed Observation
                                </Button>

                                {app.status !== "enrolled" && app.status !== "archived" && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            onClick={() => handleEnrollment(app._id, "student")}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-black font-black text-[10px] uppercase h-11 rounded-2xl shadow-xl shadow-emerald-500/10"
                                        >
                                            Admit Student
                                        </Button>
                                        <Button
                                            onClick={() => handleEnrollment(app._id, "teacher")}
                                            className="bg-sky-500 hover:bg-sky-600 text-black font-black text-[10px] uppercase h-11 rounded-2xl shadow-xl shadow-sky-500/10"
                                        >
                                            Admit Teacher
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Full Details Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 xl:p-24"
                        onClick={() => setSelectedApp(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#030712] border border-white/10 rounded-[3rem] w-full max-w-4xl max-h-full overflow-y-auto relative shadow-[0_0_100px_rgba(16,185,129,0.1)]"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-sky-400 to-indigo-500" />

                            <div className="p-8 md:p-12 space-y-12">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                            <GraduationCap className="h-10 w-10 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-amiri font-bold text-white tracking-wide">Applicant Chronicle</h2>
                                            <p className="text-zinc-500 tracking-[0.2em] font-bold uppercase text-[10px] mt-1">Reviewing celestial alignment for {selectedApp.studentName}</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setSelectedApp(null)}
                                        className="h-12 w-12 rounded-full hover:bg-white/5 border border-white/5"
                                    >
                                        <X className="h-6 w-6 text-zinc-500" />
                                    </Button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <DetailSection title="Scholar Metadata" icon={Sparkles}>
                                            <DetailItem label="Full Cosmic Name" value={selectedApp.studentName} />
                                            <DetailItem label="Orbital Cycles (Age)" value={`${selectedApp.age} Years`} />
                                            <DetailItem label="Proposed Path" value={selectedApp.plan} highlight />
                                        </DetailSection>

                                        <DetailSection title="Guardian Records" icon={Globe}>
                                            <DetailItem label="Primary Guardian" value={selectedApp.parentName} />
                                            <DetailItem label="Email Frequency" value={selectedApp.email} />
                                            <DetailItem label="Phone Coordinates" value={selectedApp.phone} />
                                        </DetailSection>
                                    </div>

                                    <div className="space-y-8">
                                        <DetailSection title="Operational Actions" icon={Zap}>
                                            <div className="space-y-4">
                                                {selectedApp.status !== "enrolled" && (
                                                    <div className="grid grid-cols-1 gap-3">
                                                        <Button
                                                            onClick={() => handleEnrollment(selectedApp._id, "student")}
                                                            className="h-16 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-black font-black text-lg tracking-tight transition-all shadow-xl shadow-emerald-500/10"
                                                        >
                                                            Enroll as Student
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleEnrollment(selectedApp._id, "teacher")}
                                                            className="h-16 rounded-[1.5rem] bg-sky-500 hover:bg-sky-600 text-black font-black text-lg tracking-tight transition-all shadow-xl shadow-sky-500/10"
                                                        >
                                                            Commission as Teacher
                                                        </Button>
                                                    </div>
                                                )}

                                                <div className="flex gap-3">
                                                    {selectedApp.status === "new" && (
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleStatusUpdate(selectedApp._id, "contacted")}
                                                            className="flex-1 h-14 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold"
                                                        >
                                                            Initiate Contact
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            handleStatusUpdate(selectedApp._id, "archived");
                                                            setSelectedApp(null);
                                                        }}
                                                        className="flex-1 h-14 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold"
                                                    >
                                                        Archive Registry
                                                    </Button>
                                                </div>
                                            </div>
                                        </DetailSection>

                                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-transparent border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Users className="h-16 w-16" />
                                            </div>
                                            <h4 className="text-lg font-bold font-amiri text-sky-400 mb-2 tracking-wide">Communication Array</h4>
                                            <p className="text-xs text-zinc-500 leading-relaxed mb-6">Reach out to the applicant team to finalize solar alignment and academic orientation.</p>
                                            <div className="flex gap-2">
                                                <ContactButton label="WhatsApp" icon={MessageCircle} link={getWhatsAppLink(selectedApp.phone, selectedApp.studentName, selectedApp.parentName)} color="bg-zinc-900 border-zinc-800 hover:border-emerald-500/40" />
                                                <ContactButton label="Email" icon={Mail} link={getEmailLink(selectedApp.email, selectedApp.studentName)} color="bg-zinc-900 border-zinc-800 hover:border-sky-500/40" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ label, value, subtitle, color, icon: Icon }: any) {
    return (
        <motion.div whileHover={{ y: -5 }}>
            <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-3xl rounded-[2rem] overflow-hidden group hover:border-white/20 transition-all border shadow-2xl">
                <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/5 transition-transform group-hover:scale-110", color)}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{label}</p>
                        <p className="text-4xl font-bold tracking-tighter text-white">{value}</p>
                        <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest pt-2 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" />
                            {subtitle}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ContactButton({ icon: Icon, label, link, color, className }: any) {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-all",
                color,
                className
            )}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </a>
    );
}

function DetailSection({ title, icon: Icon, children }: any) {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-zinc-600" />
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">{title}</h3>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function DetailItem({ label, value, highlight }: any) {
    return (
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
            <p className={cn("text-lg font-bold tracking-tight", highlight ? "text-emerald-400" : "text-zinc-200")}>
                {value || "Unknown"}
            </p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: any = {
        new: { label: "Nova Arrival", class: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
        contacted: { label: "In Alignment", class: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
        enrolled: { label: "Manifested", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
        archived: { label: "Stowed", class: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20" }
    };
    const config = configs[status] || configs.new;
    return (
        <span className={cn("inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all", config.class)}>
            {config.label}
        </span>
    );
}
