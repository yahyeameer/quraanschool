"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Sparkles, ChevronDown } from "lucide-react";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { TiltCard } from "@/components/ui/tilt-card";
import Image from "next/image";

export function HeroSection() {
    const { t, dir } = useLanguage();
    const { scrollY } = useScroll();

    // Parallax & Smooth effects
    const yText = useTransform(scrollY, [0, 500], [0, 150]);
    const yVisual = useTransform(scrollY, [0, 500], [0, -100]);
    const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
    const scaleHero = useTransform(scrollY, [0, 1000], [1, 1.1]);

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const mouseX = useSpring(0, springConfig);
    const mouseY = useSpring(0, springConfig);

    return (
        <section className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-background pt-20 transition-colors duration-500">
            {/* 1. Dynamic Background Layers - RESTORED GLOW */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Deep Space Gradients (Dark) / Soft Morning Mist (Light) */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-500/10 dark:bg-indigo-950/40 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-500/10 dark:bg-emerald-950/30 rounded-full blur-[150px] animate-pulse-slow delay-1000" />

                {/* Celestial Orbs - Restored */}
                <motion.div
                    style={{ y: yVisual, x: -50 }}
                    className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-[100px] opacity-60"
                />

                {/* Grid Overlay - Restored */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
            </div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">

                {/* 2. Text Content (Left) */}
                <motion.div
                    style={{ y: yText, opacity: opacityHero }}
                    className="space-y-10 text-center lg:text-left"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 backdrop-blur-md text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition-colors cursor-default"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Next-Gen School Management</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-bold font-amiri leading-[1.05] tracking-tight"
                    >
                        <span className="text-foreground drop-shadow-sm dark:drop-shadow-2xl">Manage with</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500 animate-shine bg-[length:200%_auto]">
                            Excellence
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto lg:mx-0"
                    >
                        {t.landing.hero.subtitle || "The complete digital ecosystem for modern Islamic institutions. Empowering teachers, engaging parents, and streamlining operations."}
                    </motion.p>

                    {/* CTAs - Enhanced Tactile Feedback */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
                    >
                        <SignedOut>
                            <SignInButton mode="modal">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-lg font-bold rounded-full shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all duration-300 cursor-pointer"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </motion.button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-lg font-bold rounded-full shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all duration-300 cursor-pointer"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Go to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </motion.button>
                            </Link>
                        </SignedIn>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-full border border-slate-200 dark:border-white/10 text-muted-foreground hover:text-foreground dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300 text-lg font-medium flex items-center gap-3 group backdrop-blur-sm cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                            <span>See How It Works</span>
                        </motion.button>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="pt-6 border-t border-slate-200 dark:border-white/5 flex items-center gap-6 justify-center lg:justify-start"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-muted-foreground dark:text-slate-400 font-bold">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <div className="text-muted-foreground dark:text-slate-400 mt-1"><span className="text-foreground dark:text-white font-semibold">500+</span> Schools Trust Us</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* 3. Visual Content (Right - 3D Mockups) */}
                <motion.div
                    style={{ y: yVisual, scale: scaleHero }}
                    className="relative h-[400px] lg:h-[800px] w-full perspective-2000 flex items-center justify-center"
                >
                    {/* Floating Glow - Softer */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 dark:from-emerald-500/20 dark:to-indigo-500/20 rounded-full blur-[120px]" />

                    {/* Main Dashboard Card - With Stronger Frame Separation */}
                    <motion.div
                        initial={{ opacity: 0, rotateX: 20, rotateY: -20, z: -100 }}
                        animate={{ opacity: 1, rotateX: 6, rotateY: -12, z: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative z-20 w-[320px] lg:w-[650px] rounded-[24px] lg:rounded-[36px] p-2 bg-gradient-to-b from-white/60 to-white/20 dark:from-slate-800/60 dark:to-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl"
                    >
                        {/* Inner Content with High Opacity to block background */}
                        <div className="rounded-[20px] lg:rounded-[32px] overflow-hidden bg-white/95 dark:bg-slate-950/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                            <Image
                                src="/dashboard-preview.png"
                                alt="Dashboard UI"
                                width={1200}
                                height={900}
                                className="w-full h-auto object-cover opacity-100"
                            />
                        </div>

                        {/* Glossy sheen */}
                        <div className="absolute inset-0 rounded-[24px] lg:rounded-[36px] bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                    </motion.div>

                    {/* Floating Widgets - Desktop Only */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, x: -50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute bottom-[25%] left-[-5%] z-30 w-[260px] p-4 rounded-2xl border border-white/60 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl dark:shadow-2xl hidden lg:block hover:scale-105 transition-transform duration-300"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-foreground dark:text-white font-bold text-sm">Monthly Revenue</h4>
                                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">+24.5%</p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.5, delay: 1.2 }}
                                className="h-full bg-emerald-500 dark:bg-emerald-400"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -50, x: 50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="absolute top-[15%] right-[-5%] z-10 w-[200px] p-3 rounded-2xl border border-white/60 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl dark:shadow-2xl hidden lg:block hover:scale-105 transition-transform duration-300"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
                            <span className="text-slate-600 dark:text-slate-200 text-xs font-medium">Live Attendance</span>
                        </div>
                        <div className="mt-1 text-xl font-bold text-foreground dark:text-white">98.2%</div>
                    </motion.div>

                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground dark:text-slate-500 dark:hover:text-white transition-colors cursor-pointer"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                </motion.div>

            </div>
        </section>
    );
}
