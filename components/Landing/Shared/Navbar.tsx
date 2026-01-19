"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/Landing/LanguageSwitcher";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20);
    });

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none",
                scrolled ? "pt-4" : "pt-6"
            )}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <div
                className={cn(
                    "pointer-events-auto flex items-center justify-between transition-all duration-500 rounded-full border backdrop-blur-xl supports-[backdrop-filter]:bg-opacity-80",
                    scrolled
                        ? "w-[90%] max-w-5xl bg-black/40 border-white/10 shadow-lg shadow-emerald-500/10 py-2.5 px-6"
                        : "w-[95%] max-w-7xl bg-transparent border-transparent py-4 px-6 md:px-10"
                )}
            >
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className={cn(
                        "relative flex items-center justify-center font-amiri font-bold text-lg rounded-full transition-all duration-500 text-white",
                        scrolled ? "h-10 w-10 bg-emerald-600" : "h-12 w-12 bg-white/10 border border-white/20"
                    )}>
                        K
                    </div>
                    <span
                        className={cn(
                            "font-amiri font-bold tracking-wide transition-all duration-500 hidden sm:block",
                            scrolled ? "text-lg text-white" : "text-xl text-white drop-shadow-md"
                        )}
                    >
                        Khalaf al Cudul
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2 bg-white/5 rounded-full p-1.5 border border-white/5 backdrop-blur-sm">
                    {[
                        { label: t.landing.features.title, href: "#features" },
                        { label: t.landing.pricing.title, href: "#pricing" },
                        { label: "About", href: "#about" }
                    ].map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="px-4 py-1.5 text-sm font-medium text-emerald-100/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions Section */}
                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />

                    <div className="h-6 w-px bg-white/20" /> {/* Divider */}

                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-sm font-medium text-white hover:text-emerald-300 transition-colors">
                                {t.common.login}
                            </button>
                        </SignInButton>
                        <Link href="/enroll">
                            <Button size="sm" className="rounded-full bg-white text-emerald-950 hover:bg-emerald-50 font-bold px-6 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-500 group">
                                <Sparkles className="w-4 h-4 mr-2 text-emerald-600 group-hover:animate-pulse" />
                                {t.common.requestDemo || "Enroll Now"}
                            </Button>
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/dashboard/manager">
                            <Button variant="ghost" className="rounded-full text-white hover:bg-white/10 gap-2 border border-white/10">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden lg:inline">{t.common.dashboard}</span>
                            </Button>
                        </Link>
                        <UserButton
                            appearance={{
                                elements: { avatarBox: "h-9 w-9 border-2 border-emerald-500/50" }
                            }}
                        />
                    </SignedIn>
                </div>

                {/* Mobile Toggle */}
                <div className="flex md:hidden items-center gap-3">
                    <LanguageSwitcher />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2.5 text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-24 left-4 right-4 md:hidden pointer-events-auto"
                    >
                        <div className="bg-emerald-950/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
                            <nav className="flex flex-col gap-2">
                                {[
                                    { label: t.landing.features.title, href: "#features" },
                                    { label: t.landing.pricing.title, href: "#pricing" },
                                    { label: "About", href: "#about" }
                                ].map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl text-emerald-100 hover:bg-white/10 hover:text-white transition-all group"
                                    >
                                        <span className="font-medium">{link.label}</span>
                                        <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex flex-col gap-3">
                                <SignedOut>
                                    <Link href="/enroll" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-12 rounded-xl text-lg shadow-lg shadow-emerald-500/20">
                                            Enroll Now
                                        </Button>
                                    </Link>
                                    <SignInButton mode="modal">
                                        <Button variant="outline" className="w-full border-white/10 text-emerald-100 hover:bg-white/10 hover:text-white h-12 rounded-xl">
                                            Log In
                                        </Button>
                                    </SignInButton>
                                </SignedOut>

                                <SignedIn>
                                    <Link href="/dashboard/manager" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-12 rounded-xl gap-2">
                                            <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                                        </Button>
                                    </Link>
                                    <div className="flex justify-center pt-2">
                                        <UserButton />
                                    </div>
                                </SignedIn>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
