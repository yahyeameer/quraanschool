"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function Pricing() {
    const { t } = useLanguage();

    const plans = [
        {
            name: "Foundation (KG - Gr 3)",
            price: "$30",
            features: ["Basic Quran Reading (Qaida)", "Islamic Studies (Seerah/Adab)", "Math & Literacy Basics", "Morning Shift Only"]
        },
        {
            name: "Hifz Intensive",
            price: "$50",
            popular: true,
            features: ["Full Quran Memorization", "Tajweed Mastery", "Daily Progress Logbook", "Priority Teacher Access", "Afternoon Shift"]
        },
        {
            name: "Khalaf Academy (Full Time)",
            price: "$80",
            features: ["Complete Dual Curriculum", "Quran + Academics (Math/Sci)", "Science Lab Access", "Extracurricular Activities", "All-Day Program"]
        }
    ];

    return (
        <section id="pricing" className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/20 pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-amiri text-4xl font-bold mb-4 dark:text-white">{t.landing.pricing.title}</h2>
                    <p className="text-muted-foreground">Select the plan that fits your educational institution.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <Card key={i} className={`relative backdrop-blur-md bg-white/5 border-white/10 ${plan.popular ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105' : 'border-white/10 hover:border-white/20'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
                                    POPULAR
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl dark:text-gray-100">{plan.name}</CardTitle>
                                <div className="mt-2">
                                    <span className="text-4xl font-bold dark:text-white">{plan.price}</span>
                                    <span className="text-muted-foreground">{t.landing.pricing.monthly}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm dark:text-gray-300">
                                            <Check className="h-4 w-4 text-emerald-400" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/enroll?plan=${encodeURIComponent(plan.name)}`} className="w-full">
                                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                                        Choose {plan.name.split(' (')[0]}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
