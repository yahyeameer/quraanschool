"use client";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";

export default function ParentDashboardError({
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
            title="Parent Portal Error"
            message="We had trouble loading your child's tracking dashboard. Give it another try!"
        />
    );
}
