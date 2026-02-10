"use client";

import { useLanguage } from "@/lib/language-context";
import { Users, BarChart3, Clock, Atom, ShieldCheck, Sparkles, BookOpen, Wallet, GraduationCap, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const bentoFeatures = [
    {
        key: 'finance',
        title: "Financial Confidence",
        icon: Wallet,
        color: "text-amber-500 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-500/10",
        colSpan: "lg:col-span-2 lg:row-span-2",
        description: "Complete financial oversight. detailed ledger for fees, salaries, and operational costs.",
        gradient: "from-amber-500/10 to-orange-500/5 dark:from-amber-500/20 dark:to-orange-500/5",
        delay: 0.1
    },
    {
        key: 'curriculum',
        title: "Smart Curriculum",
        icon: BookOpen,
        color: "text-blue-500 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-500/10",
        colSpan: "lg:col-span-1 lg:row-span-1",
        description: "Digital syllabus tracking and progress monitoring.",
        gradient: "from-blue-500/10 to-cyan-500/5 dark:from-blue-500/20 dark:to-cyan-500/5",
        delay: 0.2
    },
    {
        key: 'transport',
        title: "Live Transport",
        icon: Clock,
        color: "text-emerald-500 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-500/10",
        colSpan: "lg:col-span-1 lg:row-span-1",
        description: "Real-time updates on student pickup/drop-off.",
        gradient: "from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/5",
        delay: 0.3
    },
    {
        key: 'analytics',
        title: "Deep Analytics",
        icon: BarChart3,
        color: "text-purple-500 dark:text-purple-400",
        bg: "bg-purple-100 dark:bg-purple-500/10",
        colSpan: "lg:col-span-2 lg:row-span-1",
        description: "Turn data into decisions with comprehensive dashboard reports.",
        gradient: "from-purple-500/10 to-pink-500/5 dark:from-purple-500/20 dark:to-pink-500/5",
        delay: 0.4
    },
    {
        key: 'portals',
        title: "Role-Based Portals",
        icon: LayoutDashboard,
        color: "text-rose-500 dark:text-rose-400",
        bg: "bg-rose-100 dark:bg-rose-500/10",
        colSpan: "lg:col-span-1 lg:row-span-1",
        description: "Dedicated interfaces for Parents, Teachers, and Staff.",
        gradient: "from-rose-500/10 to-red-500/5 dark:from-rose-500/20 dark:to-red-500/5",
        delay: 0.5
    },
    {
        key: 'attendance',
        title: "Biometric Attendance",
        icon: ShieldCheck,
        color: "text-indigo-500 dark:text-indigo-400",
        bg: "bg-indigo-100 dark:bg-indigo-500/10",
        colSpan: "lg:col-span-1 lg:row-span-1",
        description: "Automated logging for precision.",
        gradient: "from-indigo-500/10 to-violet-500/5 dark:from-indigo-500/20 dark:to-violet-500/5",
        delay: 0.6
    }
];

export function FeatureGrid() {
    const { t } = useLanguage();

    return (
        <section id="features" className="py-32 relative bg-background overflow-hidden transition-colors duration-500">

            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/5 dark:from-indigo-950/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Content Container */}
            <div className="container max-w-7xl mx-auto px-4 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium mb-6 backdrop-blur-sm"
                    >
                        <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                        <span>Everything You Need</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold mb-6 text-foreground dark:text-white tracking-tight font-amiri"
                    >
                        Powerful Features for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600 dark:from-emerald-400 dark:to-blue-500">
                            Modern Institutions
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-muted-foreground dark:text-slate-400 text-lg md:text-xl leading-relaxed font-light"
                    >
                        {t.landing.features.description || "Streamline your school's operations with our comprehensive suite of tools designed for efficiency and ease of use."}
                    </motion.p>
                </div>

                {/* Bento Grid - Improved Mobile Spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(220px,auto)] md:auto-rows-[minmax(250px,auto)]">
                    {bentoFeatures.map((feature, i) => (
                        <motion.div
                            key={feature.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: feature.delay }}
                            className={cn(
                                "group relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 block liquid-border glow-on-hover cursor-pointer",
                                feature.colSpan
                            )}
                        >
                            {/* Inner Gradient */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                                feature.gradient
                            )} />

                            {/* Icon Background Blob */}
                            <div className={cn(
                                "absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500",
                                feature.bg.replace('/10', '/30') // Boost opacity for blob
                            )} />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                {/* Icon */}
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/20 dark:border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500 bg-white/80 dark:bg-slate-800/80",
                                    feature.color
                                )}>
                                    <feature.icon className="h-7 w-7" />
                                </div>

                                {/* Text */}
                                <div>
                                    <h3 className="text-2xl font-bold mb-3 text-foreground dark:text-slate-100 group-hover:text-primary dark:group-hover:text-white transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground dark:text-slate-400 leading-relaxed text-sm group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>

                            {/* Border Shine */}
                            <div className="absolute inset-0 rounded-[32px] border border-slate-200/50 dark:border-white/5 group-hover:border-slate-300/50 dark:group-hover:border-white/20 pointer-events-none transition-colors duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
