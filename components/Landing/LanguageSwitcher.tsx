"use client";

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();

    const toggleLanguage = () => {
        setLocale(locale === 'en' ? 'ar' : 'en');
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle Language">
            <Globe className="h-5 w-5" />
            <span className="sr-only">{locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}</span>
        </Button>
    );
}
