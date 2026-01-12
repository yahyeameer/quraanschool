"use client";

import React, { useState } from "react";
// Mock for now, would connect to convex/payments
export function PaymentManager() {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-8">
            <h3 className="mb-4 font-amiri text-xl font-bold">Tuition Payments</h3>
            <p className="text-sm text-muted-foreground mb-4">Track monthly tuition status.</p>

            <div className="rounded-md border border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground">Payment integration coming soon.</p>
                <button className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground text-sm">
                    Manually Log Payment
                </button>
            </div>
        </div>
    )
}
