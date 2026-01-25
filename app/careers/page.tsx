"use client";

import { Navbar } from "@/components/Landing/Shared/Navbar";
import { Footer } from "@/components/Landing/Shared/Footer";
import { motion } from "framer-motion";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-x-hidden text-white">
            <Navbar />

            <main>
                <AnimatedShaderHero
                    headline={{ line1: "Build the Future", line2: "of Education" }}
                    subtitle="Join a team passionate about blending tradition with technology."
                    className="!h-[60vh] min-h-[500px]"
                />

                <section className="py-24 relative">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-16 mb-24">
                            <div>
                                <h2 className="text-4xl font-bold font-amiri mb-6">Why Join Us?</h2>
                                <p className="text-xl text-white/60 font-light leading-relaxed">
                                    At Khalaf al Cudul, we don't just write code; we preserve heritage. You'll work on challenges that have a real impact on how millions of students connect with their faith.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <Benefit title="Remote-First" description="Work from anywhere in the world. We focus on output, not hours." />
                                <Benefit title="Competitive Salary" description="We pay top of market rates because we want the best talent." />
                                <Benefit title="Purpose Driven" description="Every line of code you write helps someone learn the Quran." />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-12 border-b border-white/10 pb-4">Open Positions</h2>

                        <div className="space-y-4">
                            <JobCard
                                title="Senior Full Stack Engineer"
                                department="Engineering"
                                location="Remote"
                                type="Full-time"
                            />
                            <JobCard
                                title="Product Designer (UI/UX)"
                                department="Design"
                                location="Remote"
                                type="Full-time"
                            />
                            <JobCard
                                title="Growth Marketing Manager"
                                department="Marketing"
                                location="London / Remote"
                                type="Full-time"
                            />
                            <JobCard
                                title="Customer Success Specialist"
                                department="Support"
                                location="Cairo / Remote"
                                type="Full-time"
                            />
                        </div>

                        <div className="mt-16 text-center p-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold mb-4">Don't see your role?</h3>
                            <p className="text-white/60 mb-8">We are always looking for exceptional talent. Send us your resume.</p>
                            <Button className="bg-white text-slate-950 hover:bg-emerald-400 transition-colors rounded-full px-8 py-6 font-bold">
                                Email General Application
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function Benefit({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Briefcase className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-white mb-1">{title}</h3>
                <p className="text-white/50 text-sm">{description}</p>
            </div>
        </div>
    );
}

function JobCard({ title, department, location, type }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl cursor-pointer group transition-colors"
        >
            <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{title}</h3>
                <div className="flex gap-4 text-sm text-white/50">
                    <span className="bg-white/5 px-2 py-1 rounded">{department}</span>
                    <span>{location}</span>
                    <span>{type}</span>
                </div>
            </div>
            <div className="mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-emerald-400" />
            </div>
        </motion.div>
    );
}
