
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
    dashboard: {
        title: string;
        welcome: string;
        stats: {
            students: string;
            attendance: string;
            progress: string;
        };
    };
    teacher: {
        attendance: {
            title: string;
            markAttendance: string;
            present: string;
            absent: string;
            late: string;
            submit: string;
            selectClass: string;
        };
        logbook: {
            title: string;
            student: string;
            topic: string;
            score: string;
            rating: string;
            notes: string;
            save: string;
        };
        classes: {
            title: string;
            newHalaqa: string;
            manage: string;
        };
    };
};

export const defaultLocale: Locale = 'en';
