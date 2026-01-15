
export type Locale = 'en' | 'ar';

export type Dictionary = {
    common: {
        welcome: string;
        login: string;
        dashboard: string;
        logout: string;
        requestDemo: string;
    };
    landing: {
        hero: {
            title: string;
            subtitle: string;
            ctaPrimary: string;
            ctaSecondary: string;
        };
        features: {
            title: string;
            description: string;
        };
        pricing: {
            title: string;
            monthly: string;
        };
    };
};

export const defaultLocale: Locale = 'en';
