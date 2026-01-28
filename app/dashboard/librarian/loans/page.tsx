"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    Search,
    Filter,
    User,
    Book,
    CheckCircle,
    AlertTriangle,
    MoreHorizontal,
    Plus,
    X,
    Calendar
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// Mock Loans Data
const initialLoans = [
    { id: 1, student: "Omar Farooq", class: "Hifz A", book: "Sahih Al-Bukhari Vol 1", borrowed: "2024-03-01", due: "2024-03-15", status: "Active" },
    { id: 2, student: "Ayesha Khan", class: "Nazra B", book: "Stories of the Prophets", borrowed: "2024-02-25", due: "2024-03-10", status: "Overdue" },
    { id: 3, student: "Bilal Ahmed", class: "Hifz B", book: "Tajweed Rules", borrowed: "2024-03-05", due: "2024-03-19", status: "Active" },
    { id: 4, student: "Fatima Zahra", class: "Tajweed C", book: "Fortress of the Muslim", borrowed: "2024-03-08", due: "2024-03-22", status: "Active" },
    { id: 5, student: "Ali Hassan", class: "Hifz A", book: "Fiqh Us-Sunnah", borrowed: "2024-02-20", due: "2024-03-05", status: "Overdue" },
];

export default function LoansPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);

    const filteredLoans = initialLoans.filter(loan => {
        const matchesTab = activeTab === "All" ||
            (activeTab === "Active" && loan.status === "Active") ||
            (activeTab === "Overdue" && loan.status === "Overdue");
        const matchesSearch = loan.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loan.book.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-8 font-sans text-slate-100 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-indigo-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[30%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Loan Management</h1>
                        <p className="text-slate-400 mt-1">Track borrowed books, manage returns, and monitor overdue items.</p>
                    </div>
                    <button
                        onClick={() => setIsNewLoanOpen(true)}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Loan
                    </button>
                </div>

                {/* Filters & Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-xl">
                    <div className="flex bg-slate-900/50 rounded-lg p-1">
                        {['All', 'Active', 'Overdue'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search student or book..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Loans Table */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/30 text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                                <th className="p-4 pl-6 font-medium">Book Details</th>
                                <th className="p-4 font-medium">Student</th>
                                <th className="p-4 font-medium">Borrowed On</th>
                                <th className="p-4 font-medium">Due Date</th>
                                <th className="p-4 font-medium text-center">Status</th>
                                <th className="p-4 pr-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-white/5">
                            <AnimatePresence>
                                {filteredLoans.map((loan) => (
                                    <motion.tr
                                        key={loan.id}
                                        className="group hover:bg-white/5 transition-colors"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-10 bg-indigo-900/50 rounded border border-indigo-500/30 flex items-center justify-center">
                                                    <Book className="w-4 h-4 text-indigo-400" />
                                                </div>
                                                <div className="font-semibold text-slate-100">{loan.book}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3 text-slate-500" />
                                                <span className="text-slate-300">{loan.student}</span>
                                                <span className="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded ml-1">{loan.class}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400">{loan.borrowed}</td>
                                        <td className={`p-4 font-mono font-medium ${loan.status === 'Overdue' ? 'text-rose-400' : 'text-slate-300'}`}>
                                            {loan.due}
                                        </td>
                                        <td className="p-4 text-center">
                                            {loan.status === 'Active' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    <CheckCircle className="w-3 h-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                    <AlertTriangle className="w-3 h-3" /> Overdue
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md text-slate-300 transition-colors border border-white/5">
                                                    Return
                                                </button>
                                                <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Loan Modal */}
            <Dialog.Root open={isNewLoanOpen} onOpenChange={setIsNewLoanOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-white/10 rounded-2xl p-6 w-[90%] max-w-md z-50 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <Dialog.Title className="text-xl font-bold text-white">Issue Book Loan</Dialog.Title>
                            <Dialog.Close className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </Dialog.Close>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Student</label>
                                <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50" placeholder="Search student..." />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Book to Issue</label>
                                <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50" placeholder="Scan ISBN or search title..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Return Date</label>
                                    <input type="date" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50" defaultValue="2024-03-24" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Duration</label>
                                    <select className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50">
                                        <option>7 Days</option>
                                        <option>14 Days (Standard)</option>
                                        <option>30 Days</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-3 text-xs text-amber-200">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <p>Student has 1 overdue book. Approval required for additional loans.</p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => setIsNewLoanOpen(false)}
                                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-indigo-500/20">
                                    Confirm Loan
                                </button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    );
}
