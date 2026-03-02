"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
    title?: string;
    message?: string;
}

export function GlobalErrorBoundary({
    error,
    reset,
    title = "Something went wrong!",
    message = "We encountered an unexpected issue while loading this section. Our team has been notified."
}: GlobalErrorProps) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="flex-1 h-full w-full flex items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-900/50 min-h-[400px]">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-950 border border-red-100 dark:border-red-900/30 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500" />

                <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 mb-6 border border-red-200 dark:border-red-800/50 shadow-inner">
                    <AlertCircle className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-amiri tracking-tight">
                    {title}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm">
                    {message}
                </p>

                <div className="flex gap-4 w-full">
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="flex-1 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        Reload Page
                    </Button>
                    <Button
                        onClick={() => reset()}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
