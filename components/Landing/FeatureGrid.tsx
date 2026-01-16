"use client";

import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BarChart3, Clock, BookOpen, ShieldCheck, Video } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
    {
        key: 'manager',
        icon: BarChart3,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        colSpan: "lg:col-span-2 lg:row-span-2",
        description: "Complete oversight for administrators with real-time financial tracking and teacher allocation.",
    },
    {
        key: 'teacher',
        icon: Users,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        colSpan: "lg:col-span-1",
        description: "Listen, grade, and track attendance with a single click.",
    },
    {
        key: 'parent',
        icon: ShieldCheck,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        colSpan: "lg:col-span-1",
        description: "Peace of mind with real-time progress reports and teacher feedback.",
    },
    {
        key: 'attendance',
        icon: Clock,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        colSpan: "lg:col-span-2",
        description: "Smart attendance tracking that integrates directly with student performance logs.",
    }
];

export function FeatureGrid() {
    const { t } = useLanguage();

    return (
        <section id="features" className="py-32 relative overflow-hidden bg-background">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="font-amiri text-5xl md:text-6xl font-bold mb-6 tracking-tight"
                    >
                        {t.landing.features.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-muted-foreground text-xl leading-relaxed"
                    >
                        {t.landing.features.description}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[240px]">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.key}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className={cn(
                                "group relative flex flex-col justify-between p-8 rounded-[2.5rem] glass-panel border-white/20 hover:border-emerald-500/30 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/5",
                                feature.colSpan
                            )}
                        >
                            <div className="relative z-10">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner",
                                    feature.bg,
                                    feature.color
                                )}>
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">
                                    {feature.key.charAt(0).toUpperCase() + feature.key.slice(1)} Dashboard
                                </h3>
                                <p className="text-muted-foreground leading-relaxed max-w-[280px]">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none">
                                <feature.icon className="h-32 w-32 rotate-12" />
                            </div>

                            {/* Hover Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
