"use client";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";

export default function LibrarianDashboardError({
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
            title="Library Portal Error"
            message="There was an issue loading your library dashboard. Please try refreshing."
        />
    );
}
