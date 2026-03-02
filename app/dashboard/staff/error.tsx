"use client";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";

export default function StaffDashboardError({
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
            title="Staff Portal Error"
            message="We encountered an issue loading this staff section. Please try again or refresh the page."
        />
    );
}
