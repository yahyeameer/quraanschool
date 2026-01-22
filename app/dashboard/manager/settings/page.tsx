"use client";

import { RoleGuard } from "@/components/Auth/RoleGuard";
import { TestNotification } from "@/components/Notifications/TestNotification";
import { Settings } from "lucide-react";

export default function ManagerSettingsPage() {
    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent italic">
                        System Configuration
                    </h2>
                    <p className="text-muted-foreground mt-1">Manage notifications and system integrations.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <TestNotification />

                    {/* Placeholder for other settings */}
                    <div className="glass-panel border-white/5 p-6 space-y-4 opacity-50">
                        <div className="flex items-center gap-2 font-semibold text-lg text-white">
                            <Settings className="h-5 w-5" />
                            General Settings
                        </div>
                        <p className="text-sm text-muted-foreground">Additional configuration options coming soon.</p>
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
