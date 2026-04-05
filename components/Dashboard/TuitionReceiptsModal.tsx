"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, CheckCircle, Clock, AlertCircle, Download, Receipt, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Payment {
    _id: string;
    month: string;
    amount: number;
    status?: string;
    date: string;
}

interface TuitionReceiptsModalProps {
    isOpen: boolean;
    onClose: () => void;
    payments: Payment[];
    studentName?: string;
}

function getStatusMeta(status?: string) {
    switch (status) {
        case "paid": return { label: "Paid", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
        case "pending": return { label: "Pending", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
        default: return { label: "Overdue", icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };
    }
}

export function TuitionReceiptsModal({ isOpen, onClose, payments, studentName }: TuitionReceiptsModalProps) {
    const totalPaid = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
    const totalPending = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);
    const paidCount = payments.filter(p => p.status === "paid").length;

    const handlePrint = () => {
        window.print();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 28, stiffness: 320 }}
                        className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-lg bg-background border border-border rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col">

                            {/* Header */}
                            <div className="relative p-6 pb-4 bg-gradient-to-br from-primary/10 to-background border-b border-border flex-shrink-0">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                            <Receipt className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-foreground text-lg">Tuition Statements</h2>
                                            {studentName && (
                                                <p className="text-xs text-muted-foreground">{studentName}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="h-9 w-9 rounded-xl bg-accent/20 hover:bg-accent/40 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Summary Row */}
                                <div className="grid grid-cols-3 gap-3 mt-5 relative z-10">
                                    <div className="rounded-2xl p-3 bg-emerald-500/10 border border-emerald-500/20">
                                        <TrendingUp className="h-4 w-4 text-emerald-500 mb-1.5" />
                                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-300">${totalPaid.toLocaleString()}</div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Paid</p>
                                    </div>
                                    <div className="rounded-2xl p-3 bg-amber-500/10 border border-amber-500/20">
                                        <Clock className="h-4 w-4 text-amber-500 mb-1.5" />
                                        <div className="text-lg font-bold text-amber-600 dark:text-amber-300">${totalPending.toLocaleString()}</div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Pending</p>
                                    </div>
                                    <div className="rounded-2xl p-3 bg-primary/10 border border-primary/20">
                                        <CheckCircle className="h-4 w-4 text-primary mb-1.5" />
                                        <div className="text-lg font-bold text-primary">{paidCount}/{payments.length}</div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Clear</p>
                                    </div>
                                </div>
                            </div>

                            {/* Receipts List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-3">
                                {payments.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground/30">
                                        <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm">No payment records found.</p>
                                    </div>
                                ) : (
                                    payments.map((p, i) => {
                                        const meta = getStatusMeta(p.status);
                                        const Icon = meta.icon;
                                        return (
                                            <motion.div
                                                key={p._id}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex items-center justify-between p-4 rounded-2xl bg-accent/10 border border-border/30 hover:bg-accent/20 transition-colors group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {/* Month Icon */}
                                                    <div className="h-11 w-11 rounded-xl bg-accent/20 border border-border/50 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-black text-muted-foreground/60">
                                                            {p.month?.slice(0, 3).toUpperCase() || "—"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground text-sm">{p.month || "Unknown Month"}</p>
                                                        <p className="text-[10px] text-muted-foreground/40">
                                                            {p.date ? new Date(p.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "Date N/A"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold", meta.bg, meta.color)}>
                                                        <Icon className="h-3 w-3" />
                                                        {meta.label}
                                                    </div>
                                                    <span className="font-bold text-foreground text-sm tabular-nums">
                                                        ${p.amount?.toLocaleString() || "0"}
                                                    </span>
                                                    {/* Receipt download placeholder */}
                                                    <button
                                                        onClick={handlePrint}
                                                        title="Print / Save Receipt"
                                                        className="h-8 w-8 rounded-lg bg-accent/20 hover:bg-accent/40 border border-border/30 flex items-center justify-center text-muted-foreground/40 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex-shrink-0 p-5 border-t border-border flex items-center justify-between gap-3">
                                <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                                    {payments.length} Transactions
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePrint}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/20 border border-border text-muted-foreground hover:text-foreground hover:bg-accent/30 text-xs font-bold transition-all"
                                    >
                                        <Download className="h-3.5 w-3.5" /> Print Statement
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
