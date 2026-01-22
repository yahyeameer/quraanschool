import React from "react";
import { Users, Clock, Hash, GraduationCap, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClassData {
    _id: string;
    name: string;
    category: string;
    teacherId: string;
    schedule: { day: string; time: string }[];
}

export function HalaqaCard({ data }: { data: ClassData }) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl p-5 shadow-2xl ring-1 ring-white/5 transition-all hover:bg-background/60"
        >
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl transition-opacity group-hover:bg-emerald-500/20" />

            <div className="mb-4 flex items-start justify-between relative z-10">
                <div className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border",
                    data.category === "Hifz" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                        data.category === "Nazra" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                            "bg-sky-500/10 border-sky-500/30 text-sky-400"
                )}>
                    {data.category}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground/60 transition-colors group-hover:text-emerald-400">
                    <Users className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Capacity: Open</span>
                </div>
            </div>

            <div className="relative z-10 space-y-2 mb-4">
                <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-emerald-500/40" />
                    <h3 className="font-amiri text-xl font-bold text-emerald-50 transition-colors group-hover:text-emerald-400">
                        {data.name}
                    </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Path: {data.category} Mastery</span>
                </div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-2 mb-4">
                {data.schedule.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[10px] font-medium text-emerald-100/70 ring-1 ring-white/5 whitespace-nowrap">
                        <Clock className="h-3 w-3 text-emerald-500" />
                        <span>{slot.day} {slot.time}</span>
                    </div>
                ))}
            </div>

            <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-6 w-6 rounded-full border border-zinc-900 bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-emerald-500/40 select-none">
                            {String.fromCharCode(64 + i)}
                        </div>
                    ))}
                    <div className="h-6 w-6 rounded-full border border-zinc-900 bg-emerald-500/20 flex items-center justify-center text-[8px] font-bold text-emerald-400">
                        +8
                    </div>
                </div>

                <div className="flex gap-2">
                    <HalaqaActions classData={data} />
                </div>
            </div>

            {/* Hover Sparkle */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="h-4 w-4 text-emerald-500/40 animate-pulse" />
            </div>
        </motion.div>
    );
}

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Pencil, Video } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function HalaqaActions({ classData }: { classData: ClassData }) {
    const deleteClass = useMutation(api.classes.deleteClass);

    // Check if user has permission (optional: could be part of a hook or context)
    // For now we rely on backend auth checks, frontend just shows button for everyone but error if unauthorized
    // Ideally we pass current user role to this component

    const handleDelete = async () => {
        try {
            await deleteClass({ classId: classData._id as any });
            toast.success("Halaqa deleted successfully");
        } catch (error) {
            toast.error("Failed to delete Halaqa");
            console.error(error);
        }
    };

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 text-[10px] font-bold text-white hover:bg-emerald-500 hover:text-black transition-all">
                        <span>Manage</span>
                        <ArrowUpRight className="h-3 w-3" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-xs font-medium" onClick={() => window.location.href = `/halaqa/${classData._id}/live`}>
                        <Video className="mr-2 h-3 w-3 text-red-500" /> Go Live
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer text-xs font-medium">
                        <Pencil className="mr-2 h-3 w-3" /> Edit Details
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="focus:bg-red-900/20 text-red-400 focus:text-red-400 cursor-pointer text-xs font-medium">
                            <Trash2 className="mr-2 h-3 w-3" /> Delete Halaqa
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                        This action cannot be undone. This will permanently delete the class
                        <span className="font-bold text-emerald-400"> "{classData.name}" </span>
                        and remove all student enrollments.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white hover:text-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white border-0"
                    >
                        Delete Class
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
