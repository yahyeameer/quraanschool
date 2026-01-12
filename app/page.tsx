"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight, Video, CheckCircle, AlertCircle } from "lucide-react";
import { ProgressRing } from "@/components/Dashboard/ProgressRing";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { RoleGuard } from "@/components/Auth/RoleGuard";

export default function Home() {
  const tasks = useQuery(api.tasks.get);

  return (
    <RoleGuard>
      <main className="min-h-screen bg-background font-sans text-foreground">
        <SignedOut>
          <div className="flex h-screen flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80')] bg-cover bg-center text-white">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="z-10 text-center">
              <h1 className="mb-4 font-amiri text-5xl font-bold md:text-7xl">Khalaf Al-Cuduul</h1>
              <p className="mb-8 text-lg text-gray-200">Preserving the Light, One Ayah at a Time.</p>
              <SignInButton mode="modal">
                <button className="rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-700">
                  Enter School
                </button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="space-y-8 p-6">
            {/* Welcome & Payment Status */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-amiri text-3xl font-bold">As-Salaamu Alaykum!</h1>
                <p className="text-muted-foreground">Ready to continue your journey?</p>
              </div>

              {/* Mock Payment Status for now */}
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950">
                <CheckCircle className="h-3 w-3" />
                <span>Tuition Paid (Jan)</span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              {/* Progress Ring Card */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-lg">Current Goal</h3>
                  <span className="text-xs text-muted-foreground">Juz Amma</span>
                </div>
                <ProgressRing progress={45} label="Surah An-Naba" subLabel="Ayah 15-30" />

                <div className="mt-6">
                  <button className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/25">
                    <Video className="h-5 w-5" />
                    <span>Join Maqra'a Live</span>
                    <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Feed & Tasks */}
              <div className="col-span-12 space-y-6 lg:col-span-8">
                {/* Next Up (Tasks) */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-amiri text-xl font-bold">Next Up</h3>
                  <div className="space-y-3">
                    {/* Static Assignments for now */}
                    <div className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold">Review Surah Al-Mulk</p>
                          <p className="text-xs text-muted-foreground">Due Tomorrow • Hifz Class</p>
                        </div>
                      </div>
                      <button className="text-xs font-medium text-primary hover:underline">Start</button>
                    </div>

                    {tasks?.map(({ _id, text }) => (
                      <div key={_id} className="flex items-center justify-between rounded-lg bg-background p-3 border border-border/50">
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <RecentActivity />
              </div>
            </div>
          </div>
        </SignedIn>
      </main>
    </RoleGuard>
  );
}
