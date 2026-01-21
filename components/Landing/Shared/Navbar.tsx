"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/Landing/LanguageSwitcher";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Sparkles, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <motion.header
            className={cn(
                "fixed top-4 left-0 right-0 z-50 flex justify-center transition-all duration-500 pointer-events-none"
            )}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <motion.div
                layout
                className={cn(
                    "pointer-events-auto flex items-center justify-between transition-all duration-500 glass-pill relative overflow-hidden",
                    scrolled
                        ? "w-[90%] max-w-4xl py-2 px-4 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] bg-black/60 dark:bg-black/60 border-white/10"
                        : "w-[95%] max-w-7xl py-4 px-8 bg-black/20 border-white/5 backdrop-blur-md"
                )}
            >
                {/* Background Tint for Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group relative z-10">
                    <div className={cn(
                        "relative flex items-center justify-center font-amiri font-bold text-lg rounded-full transition-all duration-500 text-white shadow-lg overflow-hidden",
                        scrolled ? "h-9 w-9 bg-emerald-600" : "h-11 w-11 bg-white/10 border border-white/20 group-hover:bg-white/20"
                    )}>
                        <span className="relative z-10">K</span>
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <AnimatePresence>
                        {(!scrolled || mobileMenuOpen) && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="font-amiri font-bold tracking-wide text-xl text-white drop-shadow-md hidden sm:block whitespace-nowrap overflow-hidden"
                            >
                                Khalaf al Cudul
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>

                {/* Desktop Navigation - Dynamic Positioning */}
                <nav className="hidden md:flex items-center gap-1 relative z-10">
                    {[
                        { label: t.landing.features.title, href: "#features" },
                        { label: t.landing.pricing.title, href: "#pricing" },
                        { label: "About", href: "#about" }
                    ].map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white rounded-full transition-all duration-300 hover:bg-white/10 relative group"
                        >
                            {link.label}
                            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100" />
                        </Link>
                    ))}
                </nav>

                {/* Actions Section */}
                <div className="hidden md:flex items-center gap-3 relative z-10">
                    <LanguageSwitcher />

                    <div className="h-5 w-px bg-white/10 mx-1" /> {/* Divider */}

                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-sm font-medium text-white/90 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/5">
                                {t.common.login}
                            </button>
                        </SignInButton>
                        <Link href="/enroll">
                            <Button size="sm" className={cn(
                                "rounded-full bg-white text-emerald-950 hover:bg-emerald-50 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-500 group relative overflow-hidden",
                                scrolled ? "h-9 px-4 text-xs" : "h-10 px-6"
                            )}>
                                <span className="relative z-10 flex items-center">
                                    <Sparkles className="w-3.5 h-3.5 mr-2 text-emerald-600 group-hover:rotate-12 transition-transform" />
                                    {t.common.requestDemo || "Enroll Now"}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </Button>
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/dashboard">
                            <Button variant="ghost" className="rounded-full text-white hover:bg-white/10 gap-2 border border-white/10 h-9 px-4">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden lg:inline text-xs font-medium">{t.common.dashboard}</span>
                            </Button>
                        </Link>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-9 w-9 border-2 border-white/20 hover:border-emerald-500/50 transition-colors"
                                }
                            }}
                        />
                    </SignedIn>
                </div>

                {/* Mobile Toggle */}
                <div className="flex md:hidden items-center gap-3 relative z-10">
                    <LanguageSwitcher />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-all active:scale-95 border border-white/5"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </motion.div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(10px)" }}
                        className="absolute top-24 left-4 right-4 md:hidden pointer-events-auto z-40"
                    >
                        <div className="glass-panel bg-black/80 rounded-3xl p-2 shadow-2xl overflow-hidden ring-1 ring-white/10">
                            <div className="p-4 space-y-6">
                                <nav className="grid gap-2">
                                    {[
                                        { label: t.landing.features.title, href: "#features" },
                                        { label: t.landing.pricing.title, href: "#pricing" },
                                        { label: "About", href: "#about" }
                                    ].map((link, i) => (
                                        <motion.div
                                            key={link.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl text-emerald-100/80 hover:bg-white/10 hover:text-white transition-all group border border-white/5"
                                            >
                                                <span className="font-medium text-lg">{link.label}</span>
                                                <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <SignedOut>
                                        <Link href="/enroll" onClick={() => setMobileMenuOpen(false)}>
                                            <Button className="w-full bg-white text-black hover:bg-emerald-50 font-bold h-14 rounded-2xl text-lg shadow-lg">
                                                Enroll Now
                                            </Button>
                                        </Link>
                                        <SignInButton mode="modal">
                                            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10 h-14 rounded-2xl text-lg">
                                                Log In
                                            </Button>
                                        </SignInButton>
                                    </SignedOut>

                                    <SignedIn>
                                        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                                            <UserButton />
                                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                                <Button variant="ghost" className="text-white hover:bg-white/10">
                                                    Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </SignedIn>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
