"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/Landing/LanguageSwitcher";
import { SignInButton } from "@clerk/nextjs";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
        return () => unsubscribe();
    }, [scrollY]);

    return (
        <motion.header
            className={cn(
                "fixed top-4 left-0 right-0 z-50 transition-all duration-500 mx-auto",
                isScrolled
                    ? "max-w-4xl px-4"
                    : "max-w-[1400px] px-4 md:px-6"
            )}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className={cn(
                "flex items-center justify-between transition-all duration-500 rounded-full border border-white/10 dark:border-white/5",
                isScrolled
                    ? "glass-panel px-6 py-2 shadow-2xl"
                    : "bg-transparent py-4 border-transparent"
            )}>
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-emerald-500/20 group-hover:border-emerald-500 transition-all duration-300">
                        <Image
                            src="/brand-logo.jpg"
                            alt="Khalaf al Cudul Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="font-amiri text-xl font-bold text-primary hidden sm:block">Khalaf al Cudul</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-primary transition-all">{t.landing.features.title}</Link>
                    <Link href="#pricing" className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-primary transition-all">{t.landing.pricing.title}</Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />
                    <SignInButton mode="modal">
                        <Button variant="ghost" className="rounded-full">{t.common.login}</Button>
                    </SignInButton>
                    <Button variant="premium" className="rounded-full px-6 shadow-emerald-500/10">
                        {t.common.requestDemo}
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <LanguageSwitcher />
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="md:hidden mt-2 glass-panel rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="flex flex-col p-6 gap-4">
                        <Link href="#features" className="text-sm font-medium p-2 hover:bg-white/5 rounded-lg" onClick={() => setMobileMenuOpen(false)}>{t.landing.features.title}</Link>
                        <Link href="#pricing" className="text-sm font-medium p-2 hover:bg-white/5 rounded-lg" onClick={() => setMobileMenuOpen(false)}>{t.landing.pricing.title}</Link>
                        <hr className="border-white/10" />
                        <div className="flex flex-col gap-3 mt-2">
                            <SignInButton mode="modal">
                                <Button variant="outline" className="w-full rounded-full">{t.common.login}</Button>
                            </SignInButton>
                            <Button variant="premium" className="w-full rounded-full">{t.common.requestDemo}</Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
