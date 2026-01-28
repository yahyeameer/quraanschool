"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Download,
    Plus,
    CheckCircle,
    Clock,
    AlertCircle,
    MoreHorizontal,
    X
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// Mock Data for Fees
const initialFees = [
    { id: 1, student: "Omar Farooq", class: "Hifz A", amount: 150, dueDate: "2024-03-01", status: "Paid", history: "Paid via Bank Transfer" },
    { id: 2, student: "Fatima Zahra", class: "Nazra B", amount: 120, dueDate: "2024-03-05", status: "Pending", history: "Reminder sent 2 days ago" },
    { id: 3, student: "Ali Hassan", class: "Hifz A", amount: 150, dueDate: "2024-02-01", status: "Overdue", history: "Late by 30 days" },
    { id: 4, student: "Ayesha Khan", class: "Tajweed C", amount: 100, dueDate: "2024-03-10", status: "Paid", history: "Paid via Cash" },
    { id: 5, student: "Bilal Ahmed", class: "Hifz B", amount: 150, dueDate: "2024-03-01", status: "Pending", history: "Waiting for confirmation" },
];

export default function FeesPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

    // Filter Logic
    const filteredFees = initialFees.filter(fee => {
        const matchesTab = activeTab === "All" || fee.status === activeTab;
        const matchesSearch = fee.student.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-8 font-sans text-slate-100 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-amber-600/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-purple-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Fees & Payments</h1>
                        <p className="text-slate-400 mt-1">Manage student tuition, track revenue, and record payments.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 transition-all flex items-center gap-2 backdrop-blur-md">
                            <Download className="w-4 h-4" /> Export
                        </button>
                        <button
                            onClick={() => setIsRecordModalOpen(true)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Record Payment
                        </button>
                    </div>
                </div>

                {/* Filters & Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-xl">
                    <div className="flex bg-slate-900/50 rounded-lg p-1">
                        {['All', 'Paid', 'Pending', 'Overdue'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab
                                        ? 'bg-slate-800 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Fees Table */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/30 text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                                <th className="p-4 pl-6 font-medium">Student / Class</th>
                                <th className="p-4 font-medium">Month/Type</th>
                                <th className="p-4 font-medium">Due Date</th>
                                <th className="p-4 font-medium text-right">Amount</th>
                                <th className="p-4 font-medium text-center">Status</th>
                                <th className="p-4 font-medium">History</th>
                                <th className="p-4 pr-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-white/5">
                            {filteredFees.map((fee) => (
                                <tr key={fee.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="font-semibold text-slate-100">{fee.student}</div>
                                        <div className="text-xs text-slate-500">{fee.class}</div>
                                    </td>
                                    <td className="p-4 text-slate-300">March 2024 Tuition</td>
                                    <td className="p-4 text-slate-400 font-mono">{fee.dueDate}</td>
                                    <td className="p-4 text-right font-medium text-slate-200">${fee.amount}.00</td>
                                    <td className="p-4 text-center">
                                        <StatusBadge status={fee.status} />
                                    </td>
                                    <td className="p-4 text-xs text-slate-500 max-w-[150px] truncate">{fee.history}</td>
                                    <td className="p-4 pr-6 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredFees.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            No fee records found matching your criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* Record Payment Modal */}
            <Dialog.Root open={isRecordModalOpen} onOpenChange={setIsRecordModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-white/10 rounded-2xl p-6 w-[90%] max-w-md z-50 shadow-2xl animate-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-center mb-6">
                            <Dialog.Title className="text-xl font-bold text-white">Record Payment</Dialog.Title>
                            <Dialog.Close className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </Dialog.Close>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Student Name</label>
                                <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50" placeholder="Search student..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($)</label>
                                    <input type="number" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                                    <input type="date" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Payment Method</label>
                                <select className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50">
                                    <option>Cash</option>
                                    <option>Bank Transfer</option>
                                    <option>Cheque</option>
                                    <option>Online Stripe</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Notes (Optional)</label>
                                <textarea className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50 h-20 resize-none"></textarea>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => setIsRecordModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-amber-500/20">
                                    Confirm Payment
                                </button>
                            </div>
                        </div>

                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === "Paid") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-3 h-3" /> Paid
            </span>
        );
    }
    if (status === "Pending") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-3 h-3" /> Pending
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" /> Overdue
        </span>
    );
}
