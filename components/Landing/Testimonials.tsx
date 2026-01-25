"use client";

import { useLanguage } from "@/lib/language-context";
import Marquee from "@/components/ui/marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

const reviews = [
    {
        name: "Amina Khalil",
        username: "@amina_k",
        body: "The Teacher Dashboard 2.0 is a game-changer. I can track my son's hifz progress in real-time.",
        img: "https://avatar.vercel.sh/amina",
    },
    {
        name: "Omar Farooq",
        username: "@omar_f",
        body: "Finally, a Quran school that combines traditional excellence with modern technology. The gamification keeps my kids motivated!",
        img: "https://avatar.vercel.sh/omar",
    },
    {
        name: "Sarah Jenkins",
        username: "@sarah_j",
        body: "The 'Zen Mode' for teachers allows me to grade assignments without distractions. Beautifully designed.",
        img: "https://avatar.vercel.sh/sarah",
    },
    {
        name: "Yusuf Al-Rahman",
        username: "@yusuf_r",
        body: "I love the new leaderboard system. It makes memorizing Quran feel like a fun challenge rather than a chore.",
        img: "https://avatar.vercel.sh/yusuf",
    },
    {
        name: "Fatima Syed",
        username: "@fatima_s",
        body: "The interface is stunning. It feels like using a premium app, not a typical school portal. Very impressive.",
        img: "https://avatar.vercel.sh/fatima",
    },
    {
        name: "Ibrahim Musa",
        username: "@ibrahim_m",
        body: "Management reporting tools have saved me hours of admin work every week. Highly recommended for any institution.",
        img: "https://avatar.vercel.sh/ibrahim",
    },
];

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-6 mx-4",
                "border-black/5 bg-white/50 hover:bg-white/80 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10",
                "transform hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-xl"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <Avatar className="h-10 w-10 border border-black/5 dark:border-white/10">
                    <AvatarImage src={img} alt={name} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <figcaption className="text-sm font-bold dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-muted-foreground dark:text-white/40">
                        {username}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-0.5 text-amber-500">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                </div>
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed dark:text-white/80 relative z-10">"{body}"</blockquote>

            <Quote className="absolute bottom-4 right-4 h-12 w-12 text-black/5 dark:text-white/5 -rotate-12 pointer-events-none" />
        </figure>
    );
};

export function Testimonials() {
    const { t } = useLanguage();

    return (
        <section className="py-24 relative overflow-hidden bg-background/50">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none mix-blend-multiply dark:mix-blend-screen">
                <Image
                    src="/golden-islamic-pattern.png"
                    alt="Background Pattern"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10 mb-12 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="font-amiri text-4xl md:text-5xl font-bold mb-4 tracking-tight dark:text-white"
                >
                    Trusted by Communities
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-muted-foreground max-w-2xl mx-auto"
                >
                    Join hundreds of families and institutions who have transformed their Quran learning experience with Khalaf al Cudul.
                </motion.p>
            </div>

            <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
                <Marquee pauseOnHover className="[--duration:40s]">
                    {reviews.slice(0, 3).map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:40s] mt-8">
                    {reviews.slice(3).map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>

                {/* Fade Edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background dark:from-background to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background dark:from-background to-transparent"></div>
            </div>
        </section>
    );
}
