"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Bus, Plus, X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddRouteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const createRoute = useMutation(api.transport.createRoute);
    const staff = useQuery(api.admin.listUsers); // To pick driver (Assuming listUsers returns all)
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState("");
    const [vehiclePlate, setVehiclePlate] = useState("");
    const [capacity, setCapacity] = useState(30);
    const [driverId, setDriverId] = useState("");

    const drivers = staff ? staff.filter(u => u.role === "staff" || u.role === "teacher") : [];
    // Ideally we have a 'driver' role or tag, but 'staff' works.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createRoute({
                name,
                vehiclePlate,
                capacity: Number(capacity),
                driverId: driverId ? driverId as any : undefined
            });
            toast.success("Transport route created successfully!");
            setName("");
            setVehiclePlate("");
            setCapacity(30);
            setDriverId("");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to create route");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md overflow-hidden bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl p-6"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                            <Bus className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Add New Route</h3>
                            <p className="text-xs text-zinc-400">Establish a new transport line</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Route Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Route 5 - North District"
                                className="bg-black/40 border-white/10"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Vehicle Plate</Label>
                                <Input
                                    value={vehiclePlate}
                                    onChange={(e) => setVehiclePlate(e.target.value)}
                                    placeholder="XB-1234"
                                    className="bg-black/40 border-white/10"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Capacity</Label>
                                <Input
                                    type="number"
                                    value={capacity}
                                    onChange={(e) => setCapacity(Number(e.target.value))}
                                    className="bg-black/40 border-white/10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Assign Driver (Optional)</Label>
                            <select
                                value={driverId}
                                onChange={(e) => setDriverId(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-white/10 bg-black/40 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="">Select a driver...</option>
                                {drivers.map(d => (
                                    <option key={d._id} value={d._id}>{d.name} ({d.role})</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                    <Plus className="h-5 w-5 mr-2" />
                                )}
                                Create Route
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
