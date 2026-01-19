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
    X
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ApplicationsPage() {
    const applications = useQuery(api.registrations.get);
    const updateStatus = useMutation(api.registrations.updateStatus);
    const [selectedApp, setSelectedApp] = useState<any>(null);

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
            <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                    <p className="text-sm text-muted-foreground animate-pulse">Scanning applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
            >
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                        <Users className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold font-amiri tracking-tight">Student Applications</h1>
                        <p className="text-muted-foreground">Manage incoming enrollments and waitlist requests</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "New", count: applications.filter(a => a.status === "new").length, color: "from-blue-500/20 to-blue-600/20", text: "text-blue-500" },
                    { label: "Contacted", count: applications.filter(a => a.status === "contacted").length, color: "from-amber-500/20 to-amber-600/20", text: "text-amber-500" },
                    { label: "Enrolled", count: applications.filter(a => a.status === "enrolled").length, color: "from-emerald-500/20 to-emerald-600/20", text: "text-emerald-500" },
                    { label: "Total", count: applications.length, color: "from-violet-500/20 to-violet-600/20", text: "text-violet-500" }
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className={cn("border-white/10 bg-gradient-to-br backdrop-blur-xl", stat.color)}>
                            <CardContent className="p-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                    <p className={cn("text-3xl font-bold", stat.text)}>{stat.count}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Applications Grid */}
            <Card className="border-none bg-background/50 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
                <CardHeader className="border-b border-white/5">
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-emerald-500" />
                        Recent Applications
                    </CardTitle>
                    <CardDescription>All submitted enrollment forms from the landing page</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {applications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-16 text-center space-y-4"
                        >
                            <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Users className="h-10 w-10 text-emerald-500/40" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">No Applications Yet</h3>
                                <p className="text-sm text-muted-foreground">New enrollments will appear here</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {applications.map((app, idx) => (
                                <motion.div
                                    key={app._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl p-5 ring-1 ring-white/5 transition-all hover:bg-white/5 hover:border-emerald-500/20"
                                >
                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        <Badge className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider",
                                            app.status === "new" && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                                            app.status === "contacted" && "bg-amber-500/20 text-amber-400 border-amber-500/30",
                                            app.status === "enrolled" && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                                            app.status === "archived" && "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                        )}>
                                            {app.status}
                                        </Badge>
                                    </div>

                                    {/* Student Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 flex items-center justify-center shrink-0">
                                                <User className="h-6 w-6 text-emerald-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-emerald-50 truncate">{app.studentName}</h3>
                                                <p className="text-xs text-muted-foreground">{app.age} years old</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                                    {format(new Date(app.submittedAt), "MMM d, yyyy")}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Parent Info */}
                                        <div className="space-y-2 pt-3 border-t border-white/5">
                                            <p className="text-xs font-medium text-muted-foreground">Parent: {app.parentName}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <a
                                                    href={getWhatsAppLink(app.phone, app.studentName, app.parentName)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs transition-colors"
                                                >
                                                    <MessageCircle className="h-3 w-3" />
                                                    WhatsApp
                                                </a>
                                                <a
                                                    href={getEmailLink(app.email, app.studentName)}
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs transition-colors"
                                                >
                                                    <Mail className="h-3 w-3" />
                                                    Email
                                                </a>
                                                <a
                                                    href={`tel:${app.phone}`}
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs transition-colors"
                                                >
                                                    <Phone className="h-3 w-3" />
                                                    Call
                                                </a>
                                            </div>
                                        </div>

                                        {/* Plan Badge */}
                                        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                            <Badge variant="outline" className="bg-emerald-50/5 text-emerald-300 border-emerald-500/30">
                                                {app.plan}
                                            </Badge>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-3 border-t border-white/5">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedApp(app)}
                                                className="flex-1 bg-white/5 hover:bg-white/10 border-white/10"
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                Details
                                            </Button>
                                            {app.status === "new" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(app._id, "contacted")}
                                                    className="bg-amber-500 hover:bg-amber-600 text-black"
                                                >
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Contacted
                                                </Button>
                                            )}
                                            {app.status === "contacted" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(app._id, "enrolled")}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-black"
                                                >
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Enroll
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedApp(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-background/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-white/5"
                        >
                            <div className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-white/10 p-6 z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                            <User className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold font-amiri">Application Details</h2>
                                            <p className="text-sm text-muted-foreground">{selectedApp.studentName}</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setSelectedApp(null)}
                                        className="rounded-full hover:bg-white/10"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Student Information */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Student Information</h3>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Full Name</p>
                                            <p className="font-medium">{selectedApp.studentName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Age</p>
                                            <p className="font-medium">{selectedApp.age} years old</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Selected Plan</p>
                                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                                {selectedApp.plan}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Submitted</p>
                                            <p className="font-medium">{format(new Date(selectedApp.submittedAt), "MMMM d, yyyy 'at' h:mm a")}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Parent/Guardian Information */}
                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest">Parent/Guardian Information</h3>
                                    <div className="grid gap-3">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Full Name</p>
                                            <p className="font-medium">{selectedApp.parentName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Email Address</p>
                                            <a href={`mailto:${selectedApp.email}`} className="font-medium text-blue-400 hover:underline flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                {selectedApp.email}
                                            </a>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Phone Number</p>
                                            <a href={`tel:${selectedApp.phone}`} className="font-medium text-violet-400 hover:underline flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                {selectedApp.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Actions */}
                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-sky-500 uppercase tracking-widest">Quick Actions</h3>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <a
                                            href={getWhatsAppLink(selectedApp.phone, selectedApp.studentName, selectedApp.parentName)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors border border-emerald-500/30"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            <span className="font-medium">WhatsApp</span>
                                        </a>
                                        <a
                                            href={getEmailLink(selectedApp.email, selectedApp.studentName)}
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors border border-blue-500/30"
                                        >
                                            <Mail className="h-4 w-4" />
                                            <span className="font-medium">Send Email</span>
                                        </a>
                                        <a
                                            href={`tel:${selectedApp.phone}`}
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-colors border border-violet-500/30"
                                        >
                                            <Phone className="h-4 w-4" />
                                            <span className="font-medium">Call Now</span>
                                        </a>
                                    </div>
                                </div>

                                {/* Status Actions */}
                                <div className="flex gap-3 pt-6 border-t border-white/10">
                                    {selectedApp.status === "new" && (
                                        <Button
                                            onClick={() => {
                                                handleStatusUpdate(selectedApp._id, "contacted");
                                                setSelectedApp(null);
                                            }}
                                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-black h-12"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Mark as Contacted
                                        </Button>
                                    )}
                                    {selectedApp.status === "contacted" && (
                                        <Button
                                            onClick={() => {
                                                handleStatusUpdate(selectedApp._id, "enrolled");
                                                setSelectedApp(null);
                                            }}
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black h-12"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Enroll Student
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            handleStatusUpdate(selectedApp._id, "archived");
                                            setSelectedApp(null);
                                        }}
                                        className="bg-white/5 hover:bg-white/10 border-white/10 h-12"
                                    >
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
