"use client";

import { Navbar } from "@/components/Landing/Shared/Navbar";
import { Footer } from "@/components/Landing/Shared/Footer";
import { motion } from "framer-motion";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";
import { Users, History, Target, Heart } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-x-hidden text-white">
            <Navbar />

            <main>
                <AnimatedShaderHero
                    headline={{ line1: "Rooted in Tradition,", line2: "Driven by Future" }}
                    subtitle="We are on a mission to modernize Islamic education without losing its soul."
                    className="!h-[60vh] min-h-[500px]"
                />

                <section className="py-24 relative">
                    <div className="container mx-auto px-4">

                        {/* Mission Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-b border-white/10 pb-16">
                            <Stat number="10k+" label="Students Empowered" />
                            <Stat number="50+" label="Partner Institutions" />
                            <Stat number="98%" label="Hifz Completion Rate" />
                            <Stat number="24/7" label="Support Availability" />
                        </div>

                        {/* Our Story */}
                        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                            <div className="space-y-8">
                                <h2 className="text-4xl font-bold font-amiri text-emerald-300">Our Story</h2>
                                <p className="text-xl text-white/70 leading-relaxed font-light">
                                    Khalaf al Cudul started with a simple observation: while the world was racing ahead with technology, our beloved madrasahs were left behind with pen and paper.
                                </p>
                                <p className="text-lg text-white/50 leading-relaxed">
                                    We believed that the sanctity of the Quran deserves the best tools the modern age can offer. In 2024, we launched our platform to bridge this gap, creating a system that respects tradition while embracing innovation.
                                </p>
                            </div>
                            <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/50 to-transparent z-10" />
                                <Image
                                    src="/dashboard-preview.png"
                                    alt="Our Story"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-4xl font-bold font-amiri text-center mb-16">The Journey</h2>
                            <div className="space-y-12">
                                <TimelineItem
                                    year="2023"
                                    title="The Inception"
                                    description="Concept development and pilot testing with 3 local madrasahs."
                                />
                                <TimelineItem
                                    year="2024"
                                    title="Platform Launch"
                                    description="Official release of Khalaf al Cudul V1.0. 100 institutions signed up in the first month."
                                />
                                <TimelineItem
                                    year="2025"
                                    title="Global Expansion"
                                    description="Launched multi-language support and partnered with international waqf organizations."
                                />
                                <TimelineItem
                                    year="2026"
                                    title="The Future"
                                    description="Developing AI-powered personalized Hifz tutors for every student."
                                    isFuture={true}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function Stat({ number, label }: { number: string, label: string }) {
    return (
        <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-amiri">{number}</div>
            <div className="text-emerald-400/60 text-sm uppercase tracking-widest">{label}</div>
        </div>
    );
}

function TimelineItem({ year, title, description, isFuture }: { year: string, title: string, description: string, isFuture?: boolean }) {
    return (
        <div className="flex gap-8 group">
            <div className={`flex-shrink-0 w-24 text-right font-bold text-xl ${isFuture ? "text-emerald-400" : "text-white/40 group-hover:text-white transition-colors"}`}>
                {year}
            </div>
            <div className="relative flex-1 pb-12 border-l border-white/10 pl-8">
                <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${isFuture ? "bg-emerald-400 animate-pulse" : "bg-white/20 group-hover:bg-white transition-colors"}`} />
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/60">{description}</p>
            </div>
        </div>
    );
}
