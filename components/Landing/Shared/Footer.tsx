"use client";

import { useLanguage } from "@/lib/language-context";
import { Sparkles, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-slate-950 text-white py-20 overflow-hidden border-t border-white/10">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none mix-blend-screen">
                <Image
                    src="/golden-islamic-pattern.png"
                    alt="Background Pattern"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Ambient Gradients */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-900/40 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/40 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 relative rounded-full overflow-hidden border border-white/20">
                                <Image
                                    src="/school-logo.jpg"
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="font-amiri text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                Khalaf al Cudul
                            </h3>
                        </div>
                        <p className="text-white/60 max-w-sm leading-relaxed text-lg">
                            Empowering the next generation of Quranic scholars with cutting-edge technology and traditional excellence.
                        </p>

                        <div className="flex gap-4 pt-4">
                            {/* Social Icons Placeholder */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110 transition-all cursor-pointer flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-white/50" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Platform</h4>
                        <ul className="space-y-4 text-white/60">
                            <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Stay Updated</h4>
                        <p className="text-white/60 text-sm">Join our newsletter for the latest updates and educational resources.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter email address"
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 flex-1 transition-colors"
                            />
                            <Button size="icon" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
                    <div>
                        © {currentYear} Khalaf al Cudul Project. All rights reserved.
                    </div>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
