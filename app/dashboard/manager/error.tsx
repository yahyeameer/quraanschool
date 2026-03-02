"use client";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";

export default function ManagerDashboardError({
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
            title="Manager Dashboard Error"
            message="We encountered an issue loading this manager portal section. Please try again or refresh the page."
        />
    );
}
