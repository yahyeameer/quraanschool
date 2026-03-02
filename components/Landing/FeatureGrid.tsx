"use client";

import { useLanguage } from "@/lib/language-context";
import {
    BarChart3, Clock, ShieldCheck, Sparkles,
    BookOpen, Wallet, LayoutDashboard, ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const bentoFeatures = [
    {
        key: "finance",
        title: "Financial Confidence",
        description: "Full ledger visibility for fees, salaries, and operational costs — with clean, drill-down analytics.",
        icon: Wallet,
        accent: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200/60 dark:border-amber-500/20",
        glowColor: "rgba(245,158,11,0.12)",
        colSpan: "lg:col-span-2 lg:row-span-2",
        delay: 0.05,
    },
    {
        key: "curriculum",
        title: "Smart Curriculum",
        description: "Digital syllabus tracking and per-student Ayah progress monitoring in real time.",
        icon: BookOpen,
        accent: "text-sky-600 dark:text-sky-400",
        iconBg: "bg-sky-50 dark:bg-sky-500/10 border-sky-200/60 dark:border-sky-500/20",
        glowColor: "rgba(14,165,233,0.12)",
        colSpan: "lg:col-span-1 lg:row-span-1",
        delay: 0.1,
    },
    {
        key: "transport",
        title: "Live Transport",
        description: "Real-time route tracking and instant driver notifications for student pickup and drop-off.",
        icon: Clock,
        accent: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/20",
        glowColor: "rgba(16,185,129,0.12)",
        colSpan: "lg:col-span-1 lg:row-span-1",
        delay: 0.15,
    },
    {
        key: "analytics",
        title: "Deep Analytics",
        description: "Turn raw attendance and performance data into clear, actionable KPIs across every role.",
        icon: BarChart3,
        accent: "text-violet-600 dark:text-violet-400",
        iconBg: "bg-violet-50 dark:bg-violet-500/10 border-violet-200/60 dark:border-violet-500/20",
        glowColor: "rgba(139,92,246,0.12)",
        colSpan: "lg:col-span-2 lg:row-span-1",
        delay: 0.2,
    },
    {
        key: "portals",
        title: "Role-Based Portals",
        description: "Dedicated, permission-aware interfaces for parents, teachers, accountants, and staff.",
        icon: LayoutDashboard,
        accent: "text-rose-600 dark:text-rose-400",
        iconBg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200/60 dark:border-rose-500/20",
        glowColor: "rgba(244,63,94,0.12)",
        colSpan: "lg:col-span-1 lg:row-span-1",
        delay: 0.25,
    },
    {
        key: "attendance",
        title: "Smart Attendance",
        description: "One-tap logging with automated absence alerts and streak-based gamification for students.",
        icon: ShieldCheck,
        accent: "text-indigo-600 dark:text-indigo-400",
        iconBg: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200/60 dark:border-indigo-500/20",
        glowColor: "rgba(99,102,241,0.12)",
        colSpan: "lg:col-span-1 lg:row-span-1",
        delay: 0.3,
    },
];

function BentoCard({ feature }: { feature: (typeof bentoFeatures)[number] }) {
    const Icon = feature.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: feature.delay, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer",
                "bg-white dark:bg-slate-900/70",
                "border border-slate-200 dark:border-white/8",
                "p-6 md:p-8",
                "transition-all duration-300 ease-out",
                "hover:border-slate-300 dark:hover:border-white/15",
                "hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30",
                "hover:-translate-y-0.5",
                feature.colSpan,
            )}
            style={{ willChange: "transform, box-shadow" }}
        >
            {/* Colored glow that fades in on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-inherit"
                style={{ background: `radial-gradient(ellipse at 0% 100%, ${feature.glowColor} 0%, transparent 70%)` }}
            />

            {/* Icon */}
            <div className={cn(
                "relative z-10 inline-flex w-12 h-12 rounded-xl items-center justify-center mb-5",
                "border shadow-sm",
                feature.iconBg,
                feature.accent,
                "group-hover:scale-105 transition-transform duration-300",
            )}>
                <Icon className="w-5 h-5" strokeWidth={1.8} />
            </div>

            {/* Text */}
            <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                </p>
            </div>

            {/* Arrow on hover */}
            <div className={cn(
                "absolute bottom-5 right-5 z-10",
                "w-8 h-8 rounded-full flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0",
                "transition-all duration-300",
                "bg-slate-100 dark:bg-white/10",
                feature.accent,
            )}>
                <ArrowUpRight className="w-4 h-4" />
            </div>

            {/* Subtle top-right shine */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/60 dark:from-white/5 to-transparent pointer-events-none rounded-tr-2xl" />
        </motion.div>
    );
}

export function FeatureGrid() {
    const { t } = useLanguage();

    return (
        <section id="features" className="py-24 md:py-32 relative bg-background overflow-hidden transition-colors duration-500">

            {/* Ambient top gradient */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-50 dark:from-slate-950/60 to-transparent pointer-events-none" />
            {/* Desktop-only huge ambient orb */}
            <div className="hidden md:block absolute bottom-0 right-0 w-[700px] h-[700px] bg-blue-400/5 dark:bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold mb-5 tracking-tight"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        Everything You Need
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="font-amiri text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
                    >
                        Powerful tools for{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
                            modern institutions
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed"
                    >
                        {t.landing?.features?.description ||
                            "Streamline your school's operations with a cohesive suite of tools designed for efficiency, transparency, and joy."}
                    </motion.p>
                </div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(200px,auto)] md:auto-rows-[minmax(230px,auto)]">
                    {bentoFeatures.map((f) => <BentoCard key={f.key} feature={f} />)}
                </div>
            </div>
        </section>
    );
}
