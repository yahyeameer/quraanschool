"use client";

import { UserProfile } from "@clerk/nextjs";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/Layout/LanguageSwitcher";
import { Globe, User } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const { t, locale } = useLanguage();

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <h1 className="text-3xl font-bold font-amiri tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your preferences and account settings.</p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                <div className="space-y-6">
                    {/* Language Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-primary" />
                                    Preferences
                                </CardTitle>
                                <CardDescription>
                                    Customize your viewing experience.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Language
                                        </label>
                                        <p className="text-xs text-muted-foreground">
                                            Select your preferred language interface.
                                        </p>
                                    </div>
                                    <div className="border rounded-md p-1">
                                        <LanguageSwitcher />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Profile Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="overflow-hidden bg-transparent border-0 shadow-none">
                        <CardContent className="p-0">
                            <UserProfile
                                appearance={{
                                    elements: {
                                        card: "shadow-none border border-border/50 bg-card rounded-xl",
                                        navbar: "hidden", // Hide navbar to fit better if needed, or keep it
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden"
                                    }
                                }}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
