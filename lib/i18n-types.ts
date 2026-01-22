
export type Locale = 'en' | 'ar' | 'so';

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
    sidebar: {
        dashboard: string;
        myHalaqa: string;
        quranTracker: string;
        assignments: string;
        schedule: string;
        settings: string;
        adminConsole: string;
        managerHome: string;
        applications: string;
        staff: string;
        students: string;
        fees: string;
        salaries: string;
        academic: string;
        reports: string;
        classOverview: string;
        attendance: string;
        exams: string;
        myClasses: string;
        parentView: string;
        myChild: string;
        payments: string;
        messages: string;
        analytics: string;
        signOut: string;
    };
    finance: {
        totalCollected: string;
        pendingPayments: string;
        feeRecords: string;
        student: string;
        status: string;
        amount: string;
        date: string;
        action: string;
        recordPayment: string;
        salaryPayout: string;
        totalPayout: string;
        pendingPayouts: string;
        staffMember: string;
        role: string;
        processPayout: string;
        paid: string;
        unpaid: string;
        pending: string;
    };
    academic: {
        dailyAttendance: string;
        markAttendance: string;
        selectClass: string;
        saveAttendance: string;
        present: string;
        absent: string;
        late: string;
        examManagement: string;
        scheduleExam: string;
        gradeResults: string;
        createAssessment: string;
        title: string;
        subject: string;
        totalMarks: string;
        description: string;
        submit: string;
        examResults: string;
        studentName: string;
        marksObtained: string;
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
export const locales: Locale[] = ['en', 'ar', 'so'];
