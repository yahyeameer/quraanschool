"use client";

import { useLanguage } from "@/lib/language-context";
import Marquee from "@/components/ui/marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const reviews = [
    {
        name: "Amina Khalil",
        username: "@amina_k",
        body: "The Teacher Dashboard is a game-changer. I can track my son's ḥifẓ progress in real-time from my phone.",
        img: "https://avatar.vercel.sh/amina",
        role: "Parent",
    },
    {
        name: "Omar Farooq",
        username: "@omar_f",
        body: "Finally — a platform that combines traditional excellence with modern technology. The gamification keeps my students motivated every day!",
        img: "https://avatar.vercel.sh/omar",
        role: "Teacher",
    },
    {
        name: "Sarah Jenkins",
        username: "@sarah_j",
        body: "The Zen Mode for grading is a joy. Beautifully designed, distraction-free, and incredibly fast.",
        img: "https://avatar.vercel.sh/sarah",
        role: "Admin",
    },
    {
        name: "Yusuf Al-Rahman",
        username: "@yusuf_r",
        body: "I love the leaderboard — memorizing the Quran now feels like an exciting challenge, not a chore.",
        img: "https://avatar.vercel.sh/yusuf",
        role: "Student",
    },
    {
        name: "Fatima Syed",
        username: "@fatima_s",
        body: "The interface feels premium — nothing like a typical school portal. Khalaf al Cudul is genuinely impressive.",
        img: "https://avatar.vercel.sh/fatima",
        role: "Parent",
    },
    {
        name: "Ibrahim Musa",
        username: "@ibrahim_m",
        body: "The reporting tools have saved me hours of admin work every single week. Highly recommended for any institution.",
        img: "https://avatar.vercel.sh/ibrahim",
        role: "Manager",
    },
];

const roleBadgeColor: Record<string, string> = {
    Parent: "bg-indigo-50 text-indigo-600 border-indigo-200/60 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    Teacher: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    Admin: "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    Student: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Manager: "bg-violet-50 text-violet-700 border-violet-200/60 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
};

function ReviewCard({ img, name, body, role }: { img: string; name: string; body: string; role: string }) {
    return (
        <figure className={cn(
            "relative w-80 md:w-96 mx-4 cursor-pointer overflow-hidden rounded-2xl",
            "bg-white dark:bg-slate-900",
            "border border-slate-200 dark:border-white/8",
            "p-6",
            "shadow-sm hover:shadow-lg dark:hover:shadow-black/30",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-white/15",
            "group",
        )}>
            {/* Header row */}
            <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 border-2 border-slate-100 dark:border-slate-700 shrink-0">
                    <AvatarImage src={img} alt={name} />
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold">
                        {name[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">{name}</p>
                    <span className={cn(
                        "inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                        roleBadgeColor[role] ?? "bg-slate-100 text-slate-600",
                    )}>
                        {role}
                    </span>
                </div>
                {/* Stars */}
                <div className="flex items-center gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
            </div>

            {/* Quote */}
            <blockquote className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic relative z-10">
                &ldquo;{body}&rdquo;
            </blockquote>

            {/* Decorative quote mark */}
            <div className="absolute bottom-4 right-5 opacity-[0.04] dark:opacity-[0.07] pointer-events-none group-hover:opacity-[0.07] dark:group-hover:opacity-[0.12] transition-opacity duration-300">
                <Quote className="w-10 h-10 fill-current text-slate-900 dark:text-white" />
            </div>
        </figure>
    );
}

export function Testimonials() {
    return (
        <section className="py-24 md:py-32 relative overflow-hidden bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">

            {/* Aurora ambient */}
            <div className="absolute inset-0 aurora-bg opacity-60 dark:opacity-40 pointer-events-none" />

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 relative z-10 mb-14 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-5 border border-indigo-200 dark:border-indigo-500/20"
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    Community Love
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="font-amiri text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
                >
                    Trusted by{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 dark:from-indigo-400 dark:to-sky-400">
                        communities
                    </span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
                >
                    Join hundreds of families and institutions that have transformed their Quran learning experience with Khalaf al Cudul.
                </motion.p>
            </div>

            {/* Marquee rows */}
            <div className="relative flex w-full flex-col items-center gap-4 overflow-hidden">
                <Marquee pauseOnHover className="[--duration:55s]">
                    {reviews.slice(0, 3).map(r => <ReviewCard key={r.username} {...r} />)}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:55s]">
                    {reviews.slice(3).map(r => <ReviewCard key={r.username} {...r} />)}
                </Marquee>

                {/* Fade edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10" />
            </div>
        </section>
    );
}
