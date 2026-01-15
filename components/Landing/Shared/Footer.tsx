"use client";

import { useLanguage } from "@/lib/language-context";

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-muted/30 border-t py-12 mt-20">
            <div className="container mx-auto px-4 text-center">
                <h3 className="font-amiri text-2xl font-bold mb-4">Khalaf al Cudul</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t.landing.hero.subtitle}</p>
                <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                    <span>© 2024 Khalaf al Cudul</span>
                    <span>Privacy</span>
                    <span>Terms</span>
                </div>
            </div>
        </footer>
    );
}
