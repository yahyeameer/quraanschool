"use client";

import { LogProgressForm } from "@/components/Tracker/LogProgressForm";
import { ProgressHistory } from "@/components/Tracker/ProgressHistory";

export default function TrackerPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-amiri text-3xl font-bold text-foreground sm:text-4xl">My Quran Tracker</h1>
                <p className="text-muted-foreground">"Read, ascend, and recite..."</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <LogProgressForm />
                </div>
                <div className="lg:col-span-8">
                    <ProgressHistory />
                </div>
            </div>
        </div>
    );
}
