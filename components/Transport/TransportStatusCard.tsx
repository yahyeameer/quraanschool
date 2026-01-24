"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, Clock, Phone, User, Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TransportStatusCard({ studentId }: { studentId: Id<"users"> }) {
    const data = useQuery(api.transport.getStudentTransport, { studentId });

    if (data === undefined) return (
        <Card className="border-white/10 bg-white/5 animate-pulse">
            <CardContent className="p-6 h-32 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    );

    if (data === null) return (
        <Card className="border-white/10 bg-white/5 border-dashed">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Bus className="h-6 w-6 text-zinc-500" />
                </div>
                <p className="font-medium text-sm">No Transport Assigned</p>
                <p className="text-xs text-muted-foreground">Contact admin to request bus service.</p>
            </CardContent>
        </Card>
    );

    const { route, assignment, driverName, driverPhone } = data;
    const statusColors = {
        "garage": "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
        "en-route": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse",
        "completed": "bg-blue-500/20 text-blue-400 border-blue-500/30",
        "maintenance": "bg-red-500/20 text-red-400 border-red-500/30",
        "garage-unknown": "bg-zinc-500/20 text-zinc-400", // Fallback
    };

    // Fallback if status is unknown string
    const statusColor = statusColors[route.status as keyof typeof statusColors] || statusColors["garage-unknown"];

    return (
        <Card className="border-white/10 bg-gradient-to-br from-indigo-950/30 to-background backdrop-blur-xl overflow-hidden relative">
            {/* Map Background Pattern (Mock) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <CardHeader className="pb-2 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Bus className="h-5 w-5 text-indigo-400" />
                        Transport Status
                    </CardTitle>
                    <Badge className={cn("capitalize border", statusColor)}>
                        {route.status?.replace("-", " ")}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xl font-bold tracking-tight">{route.name}</p>
                        <p className="text-xs text-muted-foreground">Plate: {route.vehiclePlate}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-muted-foreground">Driver</p>
                            <p className="font-medium text-sm truncate">{driverName || "Unassigned"}</p>
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Type</p>
                            <p className="font-medium text-sm capitalize">{assignment.type}</p>
                        </div>
                    </div>
                </div>

                {/* Tracking Visual (Mock) */}
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 bottom-0 bg-indigo-500 w-1/3 rounded-full"
                        animate={{
                            left: route.status === "en-route" ? ["0%", "70%"] : "0%",
                            width: "30%"
                        }}
                        transition={{
                            repeat: route.status === "en-route" ? Infinity : 0,
                            duration: 3,
                            ease: "easeInOut",
                            repeatType: "reverse"
                        }}
                    />
                </div>

                {driverPhone && (
                    <a
                        href={`tel:${driverPhone}`}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors border border-white/10"
                    >
                        <Phone className="h-3 w-3" />
                        Call Driver
                    </a>
                )}
            </CardContent>
        </Card>
    );
}
