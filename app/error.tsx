"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service here if needed in future
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 w-full">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Something went wrong</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            We encountered an unexpected error. Please try again or return to the homepage.
          </p>
          {process.env.NODE_ENV !== "production" && (
            <p className="text-xs text-destructive bg-destructive/5 p-2 rounded mt-2 overflow-auto text-left font-mono max-h-32">
              {error.message || "Unknown client error"}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button onClick={reset} variant="default" className="w-full sm:w-auto">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
