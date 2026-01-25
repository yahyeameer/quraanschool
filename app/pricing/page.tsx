"use client";

import { Navbar } from "@/components/Landing/Shared/Navbar";
import { Footer } from "@/components/Landing/Shared/Footer";
import { motion } from "framer-motion";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";
import { Check, Sparkles } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-x-hidden text-white">
            <Navbar />

            <main>
                <AnimatedShaderHero
                    headline={{ line1: "Simple Pricing,", line2: "Unmatched Value" }}
                    subtitle="Choose the plan that fits your institution. No hidden fees, cancel anytime."
                    className="!h-[60vh] min-h-[500px]"
                />

                <section className="py-24 relative -mt-32 z-10">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <PricingCard
                                tier="Starter"
                                price="$29"
                                description="Perfect for small madrasahs just getting started."
                                features={[
                                    "Up to 50 Students",
                                    "Basic Hifz Tracking",
                                    "Attendance Management",
                                    "Email Support"
                                ]}
                                delay={0.1}
                            />
                            <PricingCard
                                tier="Growth"
                                price="$79"
                                description="For growing institutions needing more power."
                                features={[
                                    "Up to 200 Students",
                                    "Advanced Analytics",
                                    "Parent Portal Access",
                                    "SMS Notifications",
                                    "Priority Support"
                                ]}
                                popular={true}
                                delay={0.2}
                            />
                            <PricingCard
                                tier="Enterprise"
                                price="Custom"
                                description="Tailored solutions for large organizations."
                                features={[
                                    "Unlimited Students",
                                    "Multiple Branches",
                                    "Custom White Labeling",
                                    "Dedicated Account Manager",
                                    "API Access"
                                ]}
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                <section className="py-24 text-center">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold font-amiri mb-6">Frequently Asked Questions</h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h3 className="font-bold mb-2">Can I switch plans later?</h3>
                                <p className="text-white/60">Yes, you can upgrade or downgrade your plan at any time from the billing settings.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h3 className="font-bold mb-2">Is there a free trial?</h3>
                                <p className="text-white/60">We offer a 14-day free trial on all plans. No credit card required to start.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}

function PricingCard({ tier, price, description, features, popular, delay }: any) {
    return (
        <TiltCard tiltIntensity={5} className={popular ? "scale-105 z-10" : ""}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.6 }}
                className={`relative bg-white/5 border backdrop-blur-xl p-8 rounded-[32px] h-full flex flex-col ${popular ? "border-emerald-500/50 bg-emerald-900/10 shadow-[0_0_50px_rgba(16,185,129,0.2)]" : "border-white/10"}`}
            >
                {popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Most Popular
                    </div>
                )}

                <div className="mb-8">
                    <h3 className="text-white/60 font-medium mb-2">{tier}</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-white tracking-tight">{price}</span>
                        {price !== "Custom" && <span className="text-white/40">/month</span>}
                    </div>
                    <p className="text-white/50 text-sm mt-4">{description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                    {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${popular ? "bg-emerald-500 text-white" : "bg-white/10 text-white/60"}`}>
                                <Check className="w-3 h-3" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>

                <Button className={`w-full py-6 rounded-xl font-bold text-lg ${popular ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                    Get Started
                </Button>
            </motion.div>
        </TiltCard>
    );
}
