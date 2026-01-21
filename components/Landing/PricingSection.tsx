"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Pricing() {
    const { t } = useLanguage();
    const [isAnnual, setIsAnnual] = useState(false);

    const plans = [
        {
            name: "Foundation (KG - Gr 3)",
            price: isAnnual ? "$300" : "$30",
            period: isAnnual ? "/year" : "/mo",
            features: ["Basic Quran Reading (Qaida)", "Islamic Studies (Seerah/Adab)", "Math & Literacy Basics", "Morning Shift Only"]
        },
        {
            name: "Hifz Intensive",
            price: isAnnual ? "$500" : "$50",
            period: isAnnual ? "/year" : "/mo",
            popular: true,
            features: ["Full Quran Memorization", "Tajweed Mastery", "Daily Progress Logbook", "Priority Teacher Access", "Afternoon Shift"]
        },
        {
            name: "Khalaf Academy (Full Time)",
            price: isAnnual ? "$800" : "$80",
            period: isAnnual ? "/year" : "/mo",
            features: ["Complete Dual Curriculum", "Quran + Academics (Math/Sci)", "Science Lab Access", "Extracurricular Activities", "All-Day Program"]
        }
    ];

    return (
        <section id="pricing" className="py-32 relative bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-background to-background pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-bold border border-emerald-500/20"
                    >
                        <Sparkles className="h-4 w-4" /> Transparent Pricing
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="font-amiri text-5xl font-bold dark:text-white"
                    >
                        {t.landing.pricing.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-muted-foreground text-lg"
                    >
                        Select the plan that fits your educational institution.
                    </motion.p>

                    {/* Pricing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className={cn(
                                "w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none ring-2 ring-offset-2 ring-transparent focus:ring-emerald-500",
                                isAnnual ? "bg-emerald-600" : "bg-zinc-200 dark:bg-zinc-700"
                            )}
                        >
                            <motion.div
                                className="w-6 h-6 bg-white rounded-full shadow-md"
                                animate={{ x: isAnnual ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-foreground" : "text-muted-foreground")}>
                            Yearly <span className="text-emerald-500 text-xs font-bold">(Save 15%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Card className={cn(
                                "relative h-full flex flex-col glass-card border-white/10 overflow-hidden",
                                plan.popular ? "border-emerald-500/50 shadow-2xl shadow-emerald-500/20 scale-105 z-10" : "hover:border-white/20"
                            )}>
                                {plan.popular && (
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
                                )}

                                <CardHeader>
                                    {plan.popular && (
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                                            MOST POPULAR
                                        </div>
                                    )}
                                    <CardTitle className="text-xl font-bold dark:text-gray-100">{plan.name}</CardTitle>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-5xl font-bold font-amiri dark:text-white tracking-tight">{plan.price}</span>
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    </div>
                                    <CardDescription className="text-xs mt-2">
                                        Per student, billed {isAnnual ? "annually" : "monthly"}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
                                    <ul className="space-y-4">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className="flex items-start gap-3 text-sm dark:text-gray-300">
                                                <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1 shrink-0">
                                                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <span className="opacity-90">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    <Link href={`/enroll?plan=${encodeURIComponent(plan.name)}`} className="w-full">
                                        <Button
                                            className={cn(
                                                "w-full h-12 rounded-xl font-bold text-lg transition-all duration-300",
                                                plan.popular
                                                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]"
                                                    : "bg-white/5 hover:bg-white/10 border border-white/10 text-foreground hover:border-emerald-500/30"
                                            )}
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
