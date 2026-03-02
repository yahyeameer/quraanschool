"use client";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";

export default function TeacherDashboardError({
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
            title="Teacher Portal Error"
            message="There was an issue loading your teacher cockpit. Please try refreshing."
        />
    );
}
