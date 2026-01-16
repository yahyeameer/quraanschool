"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BookOpen } from "lucide-react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

// Placeholder Lottie JSON (usually huge, just importing a small stub or fetch it)
// In a real app we'd import an actual JSON file or URL
const animationData = null; // We will handle the null case with a placeholder div

export function HeroSection() {
    const { t, dir } = useLanguage();

    return (
        <section className="relative pt-40 pb-20 overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald-500/10 blur-[130px] rounded-full opacity-50" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full" />

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-8 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        New: Teacher Dashboard 2.0
                    </motion.div>

                    <h1 className="font-amiri text-6xl md:text-8xl font-bold leading-[1.1] mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-foreground/70">
                        {t.landing.hero.title}
                    </h1>
                    <p className="text-xl text-muted-foreground/80 mb-10 text-balance max-w-xl leading-relaxed">
                        {t.landing.hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 items-center">
                        <Button size="lg" variant="premium" className="text-lg h-16 px-10 rounded-full shadow-2xl shadow-emerald-500/20 group">
                            {t.landing.hero.ctaPrimary}
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                {dir === 'ltr' ? <ArrowRight className="ml-3 h-5 w-5" /> : <ArrowRight className="mr-3 h-5 w-5 rotate-180" />}
                            </motion.span>
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg h-16 px-10 rounded-full border-2 glass-panel hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 border-transparent hover:border-emerald-500/30 transition-all duration-300">
                            <Play className="mr-3 h-4 w-4 fill-emerald-500 text-emerald-500" />
                            {t.landing.hero.ctaSecondary}
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative px-4"
                >
                    <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden glass-panel border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                        {/* Placeholder for Lottie */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {animationData ? (
                                <Lottie animationData={animationData} loop={true} />
                            ) : (
                                <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50/50 to-blue-50/50 dark:from-emerald-950/20 dark:to-blue-950/20">
                                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/20 flex items-center justify-center text-white scale-110">
                                        <BookOpen className="h-16 w-16" />
                                    </div>
                                    <p className="font-amiri text-2xl font-bold opacity-30">Interactive Demo Experience</p>
                                </div>
                            )}
                        </div>

                        {/* Floating Glass Cards for High-End Feel */}
                        <motion.div
                            animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-12 right-12 p-5 glass-panel rounded-3xl shadow-2xl border-white/20 max-w-[220px] backdrop-blur-3xl"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl shadow-lg">🎓</div>
                                <div>
                                    <div className="h-2.5 w-24 bg-foreground/20 rounded-full mb-2"></div>
                                    <div className="h-2 w-16 bg-foreground/10 rounded-full"></div>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "70%" }}
                                    transition={{ duration: 2, delay: 1 }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-12 left-12 p-5 glass-panel rounded-3xl shadow-2xl border-white/20 max-w-[220px] backdrop-blur-3xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl shadow-lg">⭐</div>
                                <div>
                                    <div className="h-2.5 w-28 bg-foreground/20 rounded-full mb-2"></div>
                                    <div className="h-2 w-20 bg-foreground/10 rounded-full"></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
