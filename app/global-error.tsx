"use client";

import { Inter } from "next/font/google";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground bg-slate-950 p-4 font-sans antialiased text-white">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                Critical System Error
              </h1>
              <p className="text-sm text-slate-400">
                A critical error occurred while rendering the application shell.
              </p>
              {process.env.NODE_ENV !== "production" && (
                <div className="mt-4 rounded bg-slate-950 p-3 text-left overflow-auto text-xs text-red-400 font-mono">
                  {error.message || "Unknown error"}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try to recover
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Home className="mr-2 h-4 w-4" />
                Reload Application
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
