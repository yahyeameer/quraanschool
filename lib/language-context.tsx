"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './locales/en';
import { ar } from './locales/ar';
import { so } from './locales/so';
import { Dictionary, Locale } from './i18n-types';

const dictionaries: Record<Locale, Dictionary> = {
    en,
    ar,
    so
};

interface LanguageContextType {
    locale: Locale;
    setLocale: (lang: Locale) => void;
    t: Dictionary;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('en');
    const [t, setT] = useState<Dictionary>(en);
    const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

    useEffect(() => {
        // Update dict
        setT(dictionaries[locale]);

        // Update direction
        const direction = locale === 'ar' ? 'rtl' : 'ltr';
        setDir(direction);

        // Update document
        document.documentElement.dir = direction;
        document.documentElement.lang = locale;
    }, [locale]);

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
