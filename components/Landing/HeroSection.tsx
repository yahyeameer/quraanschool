"use client";

import { useLanguage } from "@/lib/language-context";
import { ArrowRight, Play, Star, Users, BookOpen, Award } from "lucide-react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";

// Stat items shown beneath hero text
const stats = [
    { icon: Users, value: "500+", label: "Schools" },
    { icon: BookOpen, value: "10K+", label: "Students" },
    { icon: Award, value: "98%", label: "Satisfaction" },
];

export function HeroSection() {
    const { t } = useLanguage();
    const shouldReduceMotion = useReducedMotion();
    const { scrollY } = useScroll();

    // Gentle parallax — disabled when user prefers-reduced-motion
    const yText = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : 80]);
    const yVisual = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : -60]);
    const opacity = useTransform(scrollY, [0, 350], [1, 0]);

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
    });

    return (
        <section className="relative min-h-[105vh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-16 transition-colors duration-500">

            {/* ─── Background ──────────────────────────────── */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Ambient blobs — desktop only */}
                <div className="hidden md:block absolute top-[-15%] left-[-5%] w-[55vw] h-[55vw] bg-indigo-500/8 dark:bg-indigo-900/25 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="hidden md:block absolute bottom-[-5%] right-[-5%] w-[45vw] h-[45vw] bg-emerald-500/8 dark:bg-emerald-900/20 rounded-full blur-[120px] animate-pulse-slow [animation-delay:2s]" />
                <div className="hidden md:block absolute top-[30%] right-[15%] w-72 h-72 bg-amber-400/10 dark:bg-amber-400/8 rounded-full blur-[80px]" />

                {/* Mobile: flat static gradients (no blur overhead) */}
                <div className="md:hidden absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-background to-emerald-50/50 dark:from-indigo-950/30 dark:via-background dark:to-emerald-950/30" />

                {/* Subtle grid overlay — desktop only */}
                <div className="hidden md:block absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_30%,transparent_100%)]" />
            </div>

            {/* ─── Content grid ─────────────────────────── */}
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* LEFT – Text column */}
                <motion.div style={{ y: yText, opacity }} className="space-y-8 text-center lg:text-left">

                    {/* Live badge */}
                    <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-sm font-semibold tracking-tight cursor-default select-none">
                        <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        Next-Generation Quran School Platform
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 {...fadeUp(0.1)} className="text-5xl sm:text-6xl md:text-7xl font-bold font-amiri leading-[1.08] tracking-[-0.02em]">
                        <span className="text-foreground">Manage with</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 animate-shine bg-[length:200%_auto]">
                            Excellence
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                        {t.landing?.hero?.subtitle || "The complete digital ecosystem for modern Islamic institutions — empowering teachers, engaging families, and streamlining every operation."}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-base font-bold rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_4px_28px_rgba(16,185,129,0.55)] transition-all duration-300 cursor-pointer">
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                                </button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <Link href="/dashboard">
                                <button className="group inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-base font-bold rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_4px_28px_rgba(16,185,129,0.55)] transition-all duration-300 cursor-pointer">
                                    Go to Dashboard
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                                </button>
                            </Link>
                        </SignedIn>

                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-all duration-200 text-base font-medium cursor-pointer"
                        >
                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center">
                                <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                            See How It Works
                        </button>
                    </motion.div>

                    {/* Social Proof + Stats row */}
                    <motion.div {...fadeUp(0.45)} className="pt-6 border-t border-slate-200 dark:border-white/8">
                        {/* Avatars + stars */}
                        <div className="flex items-center gap-4 justify-center lg:justify-start mb-5">
                            <div className="flex -space-x-2.5">
                                {["A", "B", "C", "D"].map((char, i) => (
                                    <div key={i} className="w-9 h-9 rounded-full border-2 border-background bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                                        {char}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    <span className="font-bold text-slate-800 dark:text-white">500+</span> schools trust us
                                </p>
                            </div>
                        </div>
                        {/* Stat pills */}
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                            {stats.map(({ icon: Icon, value, label }) => (
                                <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
                                    <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span className="font-bold text-sm text-slate-800 dark:text-white">{value}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* RIGHT – Visual column */}
                <motion.div
                    style={{ y: yVisual }}
                    className="relative h-[360px] md:h-[520px] lg:h-[680px] w-full flex items-center justify-center"
                >
                    {/* Soft glow behind card */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-80 h-80 bg-gradient-to-tr from-emerald-400/15 to-indigo-400/15 dark:from-emerald-400/25 dark:to-indigo-400/25 rounded-full blur-[80px]" />
                    </div>

                    {/* Main dashboard card */}
                    <motion.div
                        initial={{ opacity: 0, rotateX: 14, rotateY: -10, y: 40 }}
                        animate={{ opacity: 1, rotateX: 4, rotateY: -8, y: 0 }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] as const }}
                        style={{ perspective: 1200, transformStyle: "preserve-3d" }}
                        className="relative z-20 w-[88%] sm:w-[75%] lg:w-[110%] max-w-2xl rounded-[20px] lg:rounded-[28px] p-[3px] bg-gradient-to-b from-white/50 to-white/10 dark:from-white/10 dark:to-white/5 shadow-2xl dark:shadow-black/50 border border-white/40 dark:border-white/10"
                    >
                        <div className="rounded-[18px] lg:rounded-[26px] overflow-hidden bg-white dark:bg-slate-950 shadow-inner">
                            <Image
                                src="/dashboard-preview.png"
                                alt="Khalaf Al-Cuduul Dashboard UI"
                                width={1200}
                                height={900}
                                className="w-full h-auto object-cover block"
                                priority
                            />
                        </div>
                        {/* Glass sheen */}
                        <div className="absolute inset-0 rounded-[20px] lg:rounded-[28px] bg-gradient-to-tr from-white/8 via-transparent to-transparent pointer-events-none" />
                    </motion.div>

                    {/* Floating widget — Revenue (desktop only) */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, x: -16 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
                        className="absolute bottom-[22%] left-[0%] z-30 w-56 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-black/40 backdrop-blur-xl hidden lg:block hover:-translate-y-0.5 transition-transform duration-300"
                    >
                        <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 2v20M2 12h20" /><path d="M17 7l-5-5-5 5" /></svg>
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight">Monthly Revenue</p>
                                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">+24.5% this month</p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.4, delay: 1.4, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            />
                        </div>
                    </motion.div>

                    {/* Floating widget — Attendance (desktop only) */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: 16 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] as const }}
                        className="absolute top-[12%] right-[-2%] z-30 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-black/40 backdrop-blur-xl hidden lg:block hover:-translate-y-0.5 transition-transform duration-300"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                            <span className="text-slate-600 dark:text-slate-300 text-xs font-medium whitespace-nowrap">Live Attendance</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">98.2%</div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll nudge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer group"
            >
                <span className="text-xs font-medium uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">Explore</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 animate-bounce">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </motion.div>
        </section>
    );
}
