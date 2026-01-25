"use client";

import { Navbar } from "@/components/Landing/Shared/Navbar";
import { Footer } from "@/components/Landing/Shared/Footer";
import { FeatureGrid } from "@/components/Landing/FeatureGrid";
import { motion } from "framer-motion";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";
import { Sparkles, Brain, Shield, Zap, Globe, Smartphone } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-x-hidden text-white">
            <Navbar />

            <main>
                <AnimatedShaderHero
                    headline={{ line1: "Features that", line2: "Empower Excellence" }}
                    subtitle="Discover the tools that make Khalaf al Cudul the world's most advanced Islamic school management system."
                    className="!h-[60vh] min-h-[500px]"
                />

                <section className="py-24 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold font-amiri mb-6 bg-gradient-to-r from-emerald-200 via-white to-amber-200 bg-clip-text text-transparent">
                                Comprehensive Capabilities
                            </h2>
                            <p className="text-xl text-white/60 font-light">
                                From enrollment to graduation, every step is optimized with cutting-edge technology.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={Brain}
                                title="AI-Assisted Hifz Tracking"
                                description="Our proprietary algorithm predicts memorization retention and suggests review schedules automatically."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={Globe}
                                title="Multi-Language Interface"
                                description="Seamlessly switch between Arabic, English, Somali, and more to serve your diverse community."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={Shield}
                                title="Bank-Grade Security"
                                description="Your data is encrypted at rest and in transit. Validated by top cybersecurity standards."
                                delay={0.3}
                            />
                            <FeatureCard
                                icon={Smartphone}
                                title="Mobile First Design"
                                description="Manage your institution from anywhere. Fully responsive interface for phones and tablets."
                                delay={0.4}
                            />
                            <FeatureCard
                                icon={Zap}
                                title="Instant Notifications"
                                description="Keep parents informed with real-time updates via SMS, Email, and Push Notifications."
                                delay={0.5}
                            />
                            <FeatureCard
                                icon={Sparkles}
                                title="Gamified Learning"
                                description="Engage students with streaks, badges, and leaderboards that make learning fun."
                                delay={0.6}
                            />
                        </div>
                    </div>
                </section>

                <FeatureGrid /> {/* Reusing the main grid for the detailed breakdown */}

            </main>
            <Footer />
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
    return (
        <TiltCard tiltIntensity={5} className="h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl h-full hover:bg-white/10 transition-colors group relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                    <Icon className="w-32 h-32" />
                </div>

                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                    <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors">{title}</h3>
                <p className="text-white/60 leading-relaxed z-10 relative">{description}</p>

                {/* Spotlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500" />
            </motion.div>
        </TiltCard>
    );
}
