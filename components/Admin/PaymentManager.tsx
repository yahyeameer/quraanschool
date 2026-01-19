"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DollarSign, Clock, CheckCircle } from "lucide-react";

export function PaymentManager() {
    const payments = useQuery(api.payments.list);
    const users = useQuery(api.admin.listUsers);
    const logPayment = useMutation(api.payments.logPayment);

    const [studentId, setStudentId] = useState("");
    const [amount, setAmount] = useState("50");
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));

    const handleLog = async () => {
        if (!studentId) return;
        try {
            await logPayment({
                studentId: studentId as any,
                amount: parseFloat(amount),
                month,
            });
            alert("Payment logged successfully!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-8">
            <h3 className="mb-4 font-amiri text-2xl font-bold">Tuition Financials</h3>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Form side */}
                <div className="space-y-4 rounded-lg bg-accent/20 p-4 border">
                    <h4 className="font-bold flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Log Manual Payment
                    </h4>
                    <div className="space-y-3">
                        <select
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="w-full rounded border p-2 text-sm bg-background"
                        >
                            <option value="">Select Student</option>
                            {users?.filter(u => u.role === "student").map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full rounded border p-2 text-sm bg-background"
                            placeholder="Amount ($)"
                        />
                        <input
                            type="text"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full rounded border p-2 text-sm bg-background"
                        />
                        <button
                            onClick={handleLog}
                            className="w-full rounded bg-primary py-2 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                        >
                            Confirm Deposit
                        </button>
                    </div>
                </div>

                {/* List side */}
                <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recent Transactions
                    </h4>
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                        {payments?.map((p) => {
                            const student = users?.find(u => u._id === p.studentId);
                            return (
                                <div key={p._id} className="flex items-center justify-between p-3 border rounded-lg bg-card text-sm">
                                    <div>
                                        <p className="font-medium">{student?.name || "Student"}</p>
                                        <p className="text-xs text-muted-foreground">{p.month}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-600">${p.amount}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 uppercase font-bold">
                                            <CheckCircle className="h-3 w-3" />
                                            Paid
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {payments?.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg text-sm">
                                No payments logged yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

