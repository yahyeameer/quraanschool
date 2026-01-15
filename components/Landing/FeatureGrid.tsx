"use client";

import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BarChart3, Clock, BookOpen, ShieldCheck, Video } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        key: 'manager',
        icon: BarChart3,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        colSpan: "lg:col-span-2"
    },
    {
        key: 'teacher',
        icon: Users,
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        colSpan: "lg:col-span-1"
    },
    {
        key: 'parent',
        icon: ShieldCheck,
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/20",
        colSpan: "lg:col-span-1"
    },
    {
        key: 'attendance',
        icon: Clock,
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-900/20",
        colSpan: "lg:col-span-2"
    }
];

export function FeatureGrid() {
    const { t } = useLanguage();

    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="font-amiri text-4xl font-bold mb-4">{t.landing.features.title}</h2>
                    <p className="text-muted-foreground text-lg">{t.landing.features.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className={`${feature.colSpan}`}
                        >
                            <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4`}>
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">Feature {feature.key}</CardTitle>
                                    <CardDescription>
                                        Optimized for {feature.key} workflow with efficient tools.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-32 rounded-lg bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground text-sm">
                                        UI Preview
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
