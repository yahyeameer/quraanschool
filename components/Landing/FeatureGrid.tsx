"use client";

import { useLanguage } from "@/lib/language-context";
import { Users, BarChart3, Clock, Atom, ShieldCheck, Microscope, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { TiltCard } from "@/components/ui/tilt-card";

const features = [
    {
        key: 'finance',
        title: "Financial Confidence",
        icon: BarChart3,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        colSpan: "lg:col-span-2 lg:row-span-2",
        description: "Complete financial oversight. Track student fees, staff payroll, and operational expenses in one unified ledger.",
    },
    {
        key: 'library',
        title: "Digital Library",
        icon: Atom,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        colSpan: "lg:col-span-1",
        description: "Catalog books, track borrowing, and manage digital resources for your institution.",
    },
    {
        key: 'transport',
        title: "Transport Tracking",
        icon: Clock,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        colSpan: "lg:col-span-1",
        description: "Real-time updates on bus routes and student pickup/drop-off status.",
    },
    {
        key: 'attendance',
        title: "Smart Attendance",
        icon: ShieldCheck,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        colSpan: "lg:col-span-2",
        description: "Automated attendance tracking for students and staff with biometric integration options.",
    }
];

export function FeatureGrid() {
    const { t } = useLanguage();

    return (
        <section id="features" className="py-32 relative overflow-hidden bg-background">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Logo Background Watermark */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none mix-blend-multiply dark:mix-blend-screen">
                <Image
                    src="/golden-islamic-pattern.png"
                    alt="Background Pattern"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-bold mb-6 border border-emerald-500/20 shadow-glow"
                    >
                        <Sparkles className="h-4 w-4" /> Why Choose Us
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="font-amiri text-5xl md:text-7xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-amber-200 drop-shadow-sm"
                    >
                        {t.landing.features.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-emerald-100/70 text-xl leading-relaxed font-light"
                    >
                        {t.landing.features.description}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
                    {features.map((feature, i) => (
                        <TiltCard
                            key={feature.key}
                            className={cn("h-full", feature.colSpan)}
                            tiltIntensity={10}

                        >
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                viewport={{ once: true }}
                                className={cn(
                                    "group relative flex flex-col justify-between p-8 rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm overflow-hidden h-full shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10"
                                )}
                            >
                                {/* Content */}
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-auto shadow-sm group-hover:scale-110 transition-transform duration-500 border border-white/20",
                                        feature.bg,
                                        feature.color
                                    )}>
                                        <feature.icon className="h-7 w-7" />
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base group-hover:text-foreground dark:group-hover:text-white/80 transition-colors">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative Background Icon */}
                                <div className="absolute -bottom-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none group-hover:rotate-12 transform">
                                    <feature.icon className="h-48 w-48" />
                                </div>

                                {/* Spotlight Gradient */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay"
                                />
                            </motion.div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
