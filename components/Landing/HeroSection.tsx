"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

// Placeholder Lottie JSON (usually huge, just importing a small stub or fetch it)
// In a real app we'd import an actual JSON file or URL
const animationData = null; // We will handle the null case with a placeholder div

export function HeroSection() {
    const { t, dir } = useLanguage();

    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        New: Teacher Dashboard 2.0
                    </div>

                    <h1 className="font-amiri text-5xl md:text-7xl font-bold leading-tight mb-6">
                        {t.landing.hero.title}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 text-balance max-w-xl">
                        {t.landing.hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" variant="premium" className="text-lg h-14 px-8 rounded-full">
                            {t.landing.hero.ctaPrimary}
                            {dir === 'ltr' ? <ArrowRight className="ml-2 h-5 w-5" /> : <ArrowRight className="mr-2 h-5 w-5 rotate-180" />}
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full border-2 hover:bg-muted/50">
                            <Play className="mr-2 h-4 w-4 fill-current" />
                            {t.landing.hero.ctaSecondary}
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border shadow-2xl">
                        {/* Placeholder for Lottie */}
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                            {animationData ? (
                                <Lottie animationData={animationData} loop={true} />
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full mx-auto mb-4 animate-pulse" />
                                    <p>Interactive Demo Animation</p>
                                </div>
                            )}
                        </div>

                        {/* Floating Cards for effect */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-10 p-4 bg-white dark:bg-black/80 backdrop-blur rounded-2xl shadow-lg border max-w-[200px]"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">🎓</div>
                                <div>
                                    <div className="h-2 w-20 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-2 w-12 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
