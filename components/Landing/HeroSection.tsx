import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star } from "lucide-react";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";

export function HeroSection() {
    const { t, dir } = useLanguage();

    return (
        <AnimatedShaderHero
            trustBadge={{
                text: "New: Teacher Dashboard 2.0 Launched",
                icons: ["✨", "🚀", "📱"]
            }}
            headline={{
                line1: t.landing.hero.title.split(' ').slice(0, 3).join(' '),
                line2: t.landing.hero.title.split(' ').slice(3).join(' ') || "Excellence"
            }}
            subtitle={t.landing.hero.subtitle}
            renderButtons={() => (
                <>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <ShimmerButton className="shadow-2xl scale-105 active:scale-95 transition-transform" shimmerColor="#ffffff">
                                <span className="whitespace-pre-wrap text-center text-sm font-bold leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg flex items-center gap-2">
                                    {t.landing.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
                                </span>
                            </ShimmerButton>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/dashboard">
                            <ShimmerButton className="shadow-2xl scale-105 active:scale-95 transition-transform" shimmerColor="#ffffff">
                                <span className="whitespace-pre-wrap text-center text-sm font-bold leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg flex items-center gap-2">
                                    {t.common.dashboard} <ArrowRight className="h-4 w-4" />
                                </span>
                            </ShimmerButton>
                        </Link>
                    </SignedIn>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-lg h-12 px-8 rounded-full border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white border-transparent hover:border-emerald-500/30 transition-all duration-300 group"
                        onClick={() => {
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <Play className="mr-3 h-4 w-4 fill-white text-white group-hover:scale-110 transition-transform" />
                        {t.landing.hero.ctaSecondary}
                    </Button>
                </>
            )}
        >
            {/* Additional Floating Elements for "Wow" Factor */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 text-white/40 text-sm font-medium animate-pulse">
                <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span>Trusted by 50+ Families</span>
                </div>
                <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                    <span>Certified Curriculum</span>
                </div>
            </div>
        </AnimatedShaderHero>
    );
}
