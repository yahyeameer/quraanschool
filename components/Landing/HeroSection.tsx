import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";

export function HeroSection() {
    const { t, dir } = useLanguage();

    return (
        <AnimatedShaderHero
            trustBadge={{
                text: "New: Teacher Dashboard 2.0",
                icons: ["✨", "🚀"]
            }}
            headline={{
                line1: t.landing.hero.title.split(' ').slice(0, 3).join(' '),
                line2: t.landing.hero.title.split(' ').slice(3).join(' ') || "System"
            }}
            subtitle={t.landing.hero.subtitle}
            renderButtons={() => (
                <>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <ShimmerButton className="shadow-2xl">
                                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                    {t.landing.hero.ctaPrimary}
                                </span>
                            </ShimmerButton>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/dashboard/manager">
                            <ShimmerButton className="shadow-2xl">
                                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                    {t.common.dashboard}
                                </span>
                            </ShimmerButton>
                        </Link>
                    </SignedIn>
                    <Button size="lg" variant="outline" className="text-lg h-12 px-10 rounded-full border-2 glass-panel hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 border-transparent hover:border-emerald-500/30 transition-all duration-300">
                        <Play className="mr-3 h-4 w-4 fill-emerald-500 text-emerald-500" />
                        {t.landing.hero.ctaSecondary}
                    </Button>
                </>
            )}
        />
    );
}
