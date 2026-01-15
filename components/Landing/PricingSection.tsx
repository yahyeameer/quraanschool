"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function Pricing() {
    const { t } = useLanguage();

    const plans = [
        {
            name: "Basic",
            price: "$29",
            features: ["Up to 50 students", "Basic Attendance", "Parent App (Read-only)"]
        },
        {
            name: "Pro",
            price: "$79",
            popular: true,
            features: ["Up to 200 students", "Advanced Analytics", "Teacher Dashboard", "Priority Support"]
        },
        {
            name: "Enterprise",
            price: "Custom",
            features: ["Unlimited students", "White-labeling", "API Access", "Dedicated Manager"]
        }
    ];

    return (
        <section id="pricing" className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-amiri text-4xl font-bold mb-4">{t.landing.pricing.title}</h2>
                    <p className="text-muted-foreground">Select the plan that fits your school.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <Card key={i} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                                    POPULAR
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <div className="mt-2">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">{t.landing.pricing.monthly}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-emerald-500" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                                    Choose {plan.name}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
