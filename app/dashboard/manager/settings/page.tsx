"use client";

import { RoleGuard } from "@/components/Auth/RoleGuard";
import { TestNotification } from "@/components/Notifications/TestNotification";
import { Settings, Building, Info, Image as ImageIcon, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ManagerSettingsPage() {
    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent italic">
                        System Configuration
                    </h2>
                    <p className="text-muted-foreground mt-1">Manage notifications and organization details.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <TestNotification />
                    <SchoolSettingsForm />
                </div>
            </div>
        </RoleGuard>
    );
}

function SchoolSettingsForm() {
    const settings = useQuery(api.settings.get);
    const updateSettings = useMutation(api.settings.update);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        about: "",
        logoUrl: ""
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (settings) {
            setFormData({
                name: settings.name || "",
                about: settings.about || "",
                logoUrl: settings.logoUrl || ""
            });
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.about.trim()) {
            toast.error("School Name and About sections are required.");
            return;
        }

        setIsLoading(true);
        try {
            await updateSettings({
                name: formData.name,
                about: formData.about,
                logoUrl: formData.logoUrl || undefined
            });
            toast.success("School details updated successfully!");
        } catch (error) {
            toast.error("Failed to update school details.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (settings === undefined) {
        return (
            <Card className="glass-panel border-white/5 opacity-50 flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </Card>
        );
    }

    return (
        <Card className="glass-panel border-white/5 bg-zinc-900/40 backdrop-blur-xl">
            <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold font-amiri text-white">
                    <Settings className="h-5 w-5 text-emerald-500" />
                    School Profile
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Customize the school details. These will appear on printed reports.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                            <Building className="w-4 h-4 text-emerald-400" />
                            School Name
                        </label>
                        <Input 
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g. Al-Falah Academy"
                            className="bg-zinc-950/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-blue-400" />
                            Logo Image URL
                        </label>
                        <Input 
                            value={formData.logoUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                            placeholder="e.g. https://example.com/logo.png"
                            className="bg-zinc-950/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                            <Info className="w-4 h-4 text-purple-400" />
                            About / Motto
                        </label>
                        <Textarea 
                            value={formData.about}
                            onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                            placeholder="Nurturing the generation of tomorrow..."
                            className="bg-zinc-950/50 border-white/10 text-white placeholder:text-zinc-600 min-h-[100px] resize-none focus-visible:ring-purple-500"
                        />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/20"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Configuration
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

