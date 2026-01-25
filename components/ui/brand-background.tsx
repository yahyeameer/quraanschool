"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export function BrandBackground() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 200]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0.5]);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-950">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-20 bg-[url('/noise.png')] pointer-events-none" />

            {/* Custom Golden Islamic Geometry Pattern Layer */}
            <div className="absolute inset-0 z-10 opacity-[0.15] mix-blend-screen pointer-events-none">
                <Image
                    src="/golden-islamic-pattern.png"
                    alt="Islamic Geometry Pattern"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Main Brand Image with Parallax */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 w-full h-[120%] -top-[10%]"
            >
                <Image
                    src="/brand-background.png"
                    alt="Brand Background"
                    fill
                    className="object-cover opacity-60 mix-blend-soft-light"
                    priority
                    quality={100}
                />
            </motion.div>

            {/* Animated Gradient Orbs for depth */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-900/20 blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-indigo-900/20 blur-[120px] animate-pulse-slower" />
        </div>
    );
}
