"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { AddRouteModal } from "@/components/Transport/AddRouteModal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Bus,
    Users,
    Plus,
    MapPin,
    Navigation,
    CircleDashed,
    CheckCircle2,
    Truck,
    AlertCircle,
    User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TransportManagerPage() {
    const routes = useQuery(api.transport.listRoutes);
    const updateStatus = useMutation(api.transport.updateRouteStatus);
    const [showAddModal, setShowAddModal] = useState(false);

    // Mock status toggle for demo
    const handleToggleStatus = (route: any) => {
        const nextStatus = {
            "garage": "en-route",
            "en-route": "completed",
            "completed": "garage"
        }[route.status as string] || "garage";

        updateStatus({ routeId: route._id, status: nextStatus });
    };

    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-8 p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-amiri tracking-tight">Transport Fleet</h1>
                        <p className="text-muted-foreground">Manage school bus routes, drivers, and fleet status.</p>
                    </div>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 px-6 rounded-xl shadow-lg shadow-amber-500/20"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        New Route
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-white/10 bg-gradient-to-br from-indigo-900/20 to-transparent">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Routes</p>
                                <p className="text-3xl font-bold">{routes?.length || 0}</p>
                            </div>
                            <Bus className="h-8 w-8 text-indigo-500 opacity-50" />
                        </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-gradient-to-br from-emerald-900/20 to-transparent">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active (En Route)</p>
                                <p className="text-3xl font-bold text-emerald-400">
                                    {routes?.filter(r => r.status === "en-route").length || 0}
                                </p>
                            </div>
                            <Navigation className="h-8 w-8 text-emerald-500 opacity-50" />
                        </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-gradient-to-br from-amber-900/20 to-transparent">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Students Transported</p>
                                <p className="text-3xl font-bold text-amber-400">-</p>
                            </div>
                            <Users className="h-8 w-8 text-amber-500 opacity-50" />
                        </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-gradient-to-br from-zinc-900/20 to-transparent">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">In Garage</p>
                                <p className="text-3xl font-bold">
                                    {routes?.filter(r => r.status === "garage").length || 0}
                                </p>
                            </div>
                            <Truck className="h-8 w-8 text-zinc-500 opacity-50" />
                        </CardContent>
                    </Card>
                </div>

                {/* Active Fleet Map/Grid */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-indigo-500" />
                        Fleet Status
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {routes?.map((route, idx) => (
                            <motion.div
                                key={route._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className={cn(
                                    "border-white/10 overflow-hidden transition-all duration-300",
                                    route.status === "en-route" ? "ring-1 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-background/40"
                                )}>
                                    <div className={cn(
                                        "h-2 w-full",
                                        route.status === "en-route" ? "bg-emerald-500 animate-pulse" :
                                            route.status === "completed" ? "bg-blue-500" :
                                                "bg-zinc-700"
                                    )} />

                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg">{route.name}</h3>
                                                <Badge variant="outline" className="mt-1 font-mono text-xs">
                                                    {route.vehiclePlate}
                                                </Badge>
                                            </div>
                                            <Bus className={cn(
                                                "h-8 w-8",
                                                route.status === "en-route" ? "text-emerald-500" : "text-muted-foreground/30"
                                            )} />
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                                <span className="text-muted-foreground flex items-center gap-2">
                                                    <User className="h-3 w-3" /> Driver
                                                </span>
                                                {/* Driver name currently not fetched in listRoutes, would require enriched query or separated query */}
                                                <span className="font-medium">Assigned</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                                <span className="text-muted-foreground flex items-center gap-2">
                                                    <Users className="h-3 w-3" /> Capacity
                                                </span>
                                                <span className="font-medium">{route.capacity} Seats</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-white/10 bg-white/5"
                                                onClick={() => handleToggleStatus(route)}
                                            >
                                                {route.status === "garage" && "Start Route"}
                                                {route.status === "en-route" && "Complete Route"}
                                                {route.status === "completed" && "Reset"}
                                                {route.status === "maintenance" && "Activate"}
                                            </Button>
                                            <Button size="sm" variant="ghost" className="px-3">
                                                Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}

                        {routes?.length === 0 && (
                            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                                <Bus className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No vehicles in the fleet yet.</p>
                                <Button variant="link" onClick={() => setShowAddModal(true)} className="text-amber-500">
                                    Add your first route
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <AddRouteModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
            </div>
        </RoleGuard>
    );
}
