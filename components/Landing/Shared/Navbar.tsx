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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2 bg-background/80 backdrop-blur-md border-b" : "py-6 bg-transparent"}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-emerald-500/20 group-hover:border-emerald-500 transition-colors">
                        <Image
                            src="/brand-logo.jpg"
                            alt="Khalaf al Cudul Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="font-amiri text-2xl font-bold text-primary hidden sm:block">Khalaf al Cudul</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">{t.landing.features.title}</Link>
                    <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">{t.landing.pricing.title}</Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />
                    <SignInButton mode="modal">
                        <Button variant="ghost">{t.common.login}</Button>
                    </SignInButton>
                    <Button variant="premium">{t.common.requestDemo}</Button>
                </div>

                {/* Mobile Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <LanguageSwitcher />
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="md:hidden bg-background border-b"
                >
                    <div className="flex flex-col p-4 gap-4">
                        <Link href="#features" className="text-sm font-medium p-2" onClick={() => setMobileMenuOpen(false)}>{t.landing.features.title}</Link>
                        <Link href="#pricing" className="text-sm font-medium p-2" onClick={() => setMobileMenuOpen(false)}>{t.landing.pricing.title}</Link>
                        <div className="flex gap-2 mt-2">
                            <SignInButton mode="modal">
                                <Button variant="outline" className="w-full">{t.common.login}</Button>
                            </SignInButton>
                            <Button variant="premium" className="w-full">{t.common.requestDemo}</Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
