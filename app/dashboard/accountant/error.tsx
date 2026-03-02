"use client";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";

export default function AccountantDashboardError({
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
            title="Financial Portal Error"
            message="We encountered an issue loading this financial section. Please try again or refresh the page."
        />
    );
}
