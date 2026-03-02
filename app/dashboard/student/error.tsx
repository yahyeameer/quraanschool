"use client";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";

export default function StudentDashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <GlobalErrorBoundary
            error={error}
            reset={reset}
            title="Student Portal Error"
            message="We had trouble loading your learning dashboard. Give it another try!"
        />
    );
}
