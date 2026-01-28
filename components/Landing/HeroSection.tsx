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
        <section className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-20">
            {/* 1. Dynamic Background Layers */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Deep Space Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-950/40 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-950/30 rounded-full blur-[150px] animate-pulse-slow delay-1000" />

                {/* Celestial Orbs */}
                <motion.div
                    style={{ y: yVisual, x: -50 }}
                    className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] opacity-60"
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-500/30 backdrop-blur-md text-indigo-300 text-sm font-medium shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:bg-indigo-900/50 transition-colors cursor-default"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
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
                        <span className="text-slate-100 drop-shadow-2xl">Manage with</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 animate-shine bg-[length:200%_auto]">
                            Excellence
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0"
                    >
                        {t.landing.hero.subtitle || "The complete digital ecosystem for modern Islamic institutions. Empowering teachers, engaging parents, and streamlining operations."}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
                    >
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-lg font-bold rounded-full shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 rounded-full bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <Link href="/dashboard">
                                <button className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-lg font-bold rounded-full shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Go to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </Link>
                        </SignedIn>

                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-full border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300 text-lg font-medium flex items-center gap-3 group backdrop-blur-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                            <span>See How It Works</span>
                        </button>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="pt-6 border-t border-white/5 flex items-center gap-6 justify-center lg:justify-start"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-bold">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <div className="flex items-center gap-1 text-amber-400">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <div className="text-slate-400 mt-1"><span className="text-white font-semibold">500+</span> Schools Trust Us</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* 3. Visual Content (Right - 3D Mockups) */}
                <motion.div
                    style={{ y: yVisual, scale: scaleHero }}
                    className="relative hidden lg:block h-[800px] w-full perspective-2000"
                >
                    {/* Floating Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/20 to-purple-500/20 rounded-full blur-[100px] animate-pulse-slow" />

                    {/* Main Dashboard Card */}
                    <motion.div
                        initial={{ opacity: 0, rotateX: 20, rotateY: -20, z: -100 }}
                        animate={{ opacity: 1, rotateX: 6, rotateY: -12, z: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute top-[10%] right-[5%] z-20 w-[650px] rounded-[32px] overflow-hidden border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-slate-900/90 backdrop-blur-xl"
                    >
                        <Image
                            src="/dashboard-preview.png"
                            alt="Dashboard UI"
                            width={1200}
                            height={900}
                            className="w-full h-auto object-cover opacity-90 transition-opacity hover:opacity-100"
                        />
                        {/* Glass Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                    </motion.div>

                    {/* Floating Widgets */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, x: -50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute bottom-[20%] left-[0%] z-30 w-[280px] p-5 rounded-2xl border border-white/10 bg-slate-800/80 backdrop-blur-md shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Monthly Revenue</h4>
                                <p className="text-emerald-400 text-xs font-bold">+24.5% vs last mo.</p>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.5, delay: 1.2 }}
                                className="h-full bg-emerald-400"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -50, x: 50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="absolute top-[5%] right-[0%] z-10 w-[220px] p-4 rounded-2xl border border-white/10 bg-slate-800/80 backdrop-blur-md shadow-2xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-slate-200 text-sm font-medium">Live Attendance</span>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">98.2%</div>
                    </motion.div>

                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 cursor-pointer hover:text-white transition-colors"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                </motion.div>

            </div>
        </section>
    );
}
