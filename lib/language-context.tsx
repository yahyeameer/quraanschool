"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, Dictionary, defaultLocale } from './i18n-types';
import { en } from './locales/en';
import { ar } from './locales/ar';

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Dictionary;
    dir: 'ltr' | 'rtl';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>(defaultLocale);
    const [t, setT] = useState<Dictionary>(en);
    const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

    useEffect(() => {
        // Load dictionary based on locale
        const dictionary = locale === 'ar' ? ar : en;
        setT(dictionary);
        const direction = locale === 'ar' ? 'rtl' : 'ltr';
        setDir(direction);

        // Update HTML attribute
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
