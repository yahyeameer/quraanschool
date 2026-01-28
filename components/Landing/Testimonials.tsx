"use client";

import { useLanguage } from "@/lib/language-context";
import Marquee from "@/components/ui/marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

const reviews = [
    {
        name: "Amina Khalil",
        username: "@amina_k",
        body: "The Teacher Dashboard 2.0 is a game-changer. I can track my son's hifz progress in real-time.",
        img: "https://avatar.vercel.sh/amina",
        role: "Parent"
    },
    {
        name: "Omar Farooq",
        username: "@omar_f",
        body: "Finally, a Quran school that combines traditional excellence with modern technology. The gamification keeps my kids motivated!",
        img: "https://avatar.vercel.sh/omar",
        role: "Teacher"
    },
    {
        name: "Sarah Jenkins",
        username: "@sarah_j",
        body: "The 'Zen Mode' for teachers allows me to grade assignments without distractions. Beautifully designed.",
        img: "https://avatar.vercel.sh/sarah",
        role: "Admin"
    },
    {
        name: "Yusuf Al-Rahman",
        username: "@yusuf_r",
        body: "I love the new leaderboard system. It makes memorizing Quran feel like a fun challenge rather than a chore.",
        img: "https://avatar.vercel.sh/yusuf",
        role: "Student"
    },
    {
        name: "Fatima Syed",
        username: "@fatima_s",
        body: "The interface is stunning. It feels like using a premium app, not a typical school portal. Very impressive.",
        img: "https://avatar.vercel.sh/fatima",
        role: "Parent"
    },
    {
        name: "Ibrahim Musa",
        username: "@ibrahim_m",
        body: "Management reporting tools have saved me hours of admin work every week. Highly recommended for any institution.",
        img: "https://avatar.vercel.sh/ibrahim",
        role: "Manager"
    },
];

const ReviewCard = ({
    img,
    name,
    username,
    body,
    role
}: {
    img: string;
    name: string;
    username: string;
    body: string;
    role: string;
}) => {
    return (
        <figure
            className={cn(
                "relative w-96 cursor-pointer overflow-hidden rounded-2xl border p-8 mx-6",
                "border-white/10 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/60",
                "transform hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 group"
            )}
        >
            <div className="flex flex-row items-center gap-4 mb-6">
                <Avatar className="h-12 w-12 border-2 border-indigo-500/30">
                    <AvatarImage src={img} alt={name} />
                    <AvatarFallback className="bg-slate-800 text-slate-200">{name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <figcaption className="text-base font-bold text-slate-100 group-hover:text-white transition-colors">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">
                        {role}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-0.5 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs font-bold ml-1">5.0</span>
                </div>
            </div>

            <blockquote className="text-sm leading-relaxed text-slate-300 group-hover:text-slate-200 transition-colors relative z-10">
                "{body}"
            </blockquote>

            {/* Quote Icon */}
            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-8 w-8 text-white fill-current" />
            </div>

            {/* Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </figure>
    );
};

export function Testimonials() {
    const { t } = useLanguage();

    return (
        <section className="py-32 relative overflow-hidden bg-slate-950 border-t border-white/5">

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold mb-6 border border-indigo-500/20 shadow-glow"
                >
                    <Sparkles className="h-4 w-4" /> Community Love
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="font-amiri text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white"
                >
                    Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Communities</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-slate-400 text-lg max-w-2xl mx-auto font-light"
                >
                    Join hundreds of families and institutions who have transformed their Quran learning experience with Khalaf al Cudul.
                </motion.p>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                <Marquee pauseOnHover className="[--duration:60s] py-4">
                    {reviews.slice(0, 3).map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:60s] py-4">
                    {reviews.slice(3).map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>

                {/* Fade Edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>
            </div>
        </section>
    );
}
