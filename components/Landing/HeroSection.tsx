"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Sparkles, ChevronDown } from "lucide-react";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { TiltCard } from "@/components/ui/tilt-card";
import Image from "next/image";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";

export function HeroSection() {
    const { t, dir } = useLanguage();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <AnimatedShaderHero
            headline={{ line1: "", line2: "" }} // Headlines handled in children for custom layout
            subtitle=""
            className="!h-auto min-h-[90vh]"
        >
            <div className="relative z-10 w-full pt-24 pb-12 px-4">
                {/* Spotlight Effect */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

                <div className="container max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-emerald-300 text-sm font-medium shadow-glow hover:bg-white/10 transition-colors"
                        >
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            <span>Teacher Dashboard 2.0 Now Live</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold font-amiri leading-[1.1] tracking-tight">
                            <span className="text-white drop-shadow-sm">{t.landing.hero.title.split(' ').slice(0, 3).join(' ')}</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 animate-aurora relative">
                                {t.landing.hero.title.split(' ').slice(3).join(' ') || "Excellence"}
                                {/* Text Glow */}
                                <span className="absolute inset-0 bg-emerald-400/20 blur-xl -z-10" />
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
                            {t.landing.hero.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <ShimmerButton className="shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-110 active:scale-95 transition-transform" shimmerColor="#34d399">
                                        <span className="whitespace-pre-wrap text-center text-sm font-bold leading-none tracking-tight text-white lg:text-lg flex items-center gap-2">
                                            {t.landing.hero.ctaPrimary} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </ShimmerButton>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <Link href="/dashboard">
                                    <ShimmerButton className="shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-110 active:scale-95 transition-transform" shimmerColor="#34d399">
                                        <span className="whitespace-pre-wrap text-center text-sm font-bold leading-none tracking-tight text-white lg:text-lg flex items-center gap-2">
                                            {t.common.dashboard} <ArrowRight className="h-5 w-5" />
                                        </span>
                                    </ShimmerButton>
                                </Link>
                            </SignedIn>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 rounded-full border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white hover:text-emerald-300 border-transparent hover:border-emerald-500/30 transition-all duration-300 group text-base"
                                onClick={() => {
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <Play className="mr-3 h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                                {t.landing.hero.ctaSecondary}
                            </Button>
                        </div>

                        <div className="pt-8 flex items-center gap-8 justify-center lg:justify-start text-white/50 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
                                <span>Trusted by 50+ Families</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-emerald-500 fill-emerald-500 animate-pulse delay-300" />
                                <span>Certified Curriculum</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3D Visuals */}
                    <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
                        {/* Floating Quran App Interface */}
                        <motion.div style={{ y: y1 }} className="absolute top-10 right-10 z-20 w-[450px]">
                            <TiltCard tiltIntensity={15}>
                                <div className="relative aspect-[4/3] rounded-[20px] border-[1px] border-white/20 bg-slate-900/80 overflow-hidden shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
                                    <Image
                                        src="/dashboard-preview.png"
                                        alt="App Interface"
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                                </div>
                            </TiltCard>
                        </motion.div>

                        {/* Floating Decorative Elements */}
                        <motion.div style={{ y: y2 }} className="absolute bottom-20 left-10 z-10 w-[280px]">
                            <TiltCard tiltIntensity={20}>
                                <div className="glass-card p-6 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <Sparkles className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">Daily Progress</h4>
                                            <p className="text-white/60 text-xs">Consistent Growth</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "75%" }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-emerald-400"
                                        />
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white transition-colors cursor-pointer"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <div className="h-10 w-6 rounded-full border-2 border-current flex justify-center pt-2">
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="h-2 w-1 bg-current rounded-full"
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatedShaderHero>
    );
}
