"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    FileText,
    DollarSign,
    Calendar,
    Tag,
    Receipt
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

// Mock Expenses Data
const expenses = [
    { id: 1, title: "Office Rent", category: "Rent", amount: 1200, date: "2024-03-01", status: "Paid", vendor: "City Center Properties" },
    { id: 2, title: "Staff Lunch Catering", category: "Food", amount: 250, date: "2024-03-05", status: "Paid", vendor: "Tasty Bites" },
    { id: 3, title: "Electricity Bill", category: "Utility", amount: 340, date: "2024-02-28", status: "Paid", vendor: "Power Corp" },
    { id: 4, title: "New Whiteboards", category: "Equipment", amount: 150, date: "2024-03-10", status: "Pending", vendor: "Office Supplies Co." },
    { id: 5, title: "Internet Subscription", category: "Utility", amount: 80, date: "2024-03-01", status: "Paid", vendor: "FiberNet" },
];

export default function ExpensesPage() {
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-8 font-sans text-slate-100 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-rose-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-slate-800/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Expenses Tracking</h1>
                        <p className="text-slate-400 mt-1">Monitor operational costs and manage reimbursements.</p>
                    </div>
                    <button
                        onClick={() => setIsAddExpenseOpen(true)}
                        className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Expense
                    </button>
                </div>

                {/* Categories & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {['All', 'Rent', 'Utility', 'Salary', 'Equipment'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`p-4 rounded-xl border transition-all text-left ${activeCategory === cat
                                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                        >
                            <div className="text-xs uppercase tracking-wide opacity-70 mb-1">{cat}</div>
                            <div className="text-lg font-bold">
                                {cat === 'All' ? '$12,450' : '$2,300'}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Expenses List */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-200">Recent Transactions</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search expense..."
                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {expenses.map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between p-4 bg-slate-900/30 border border-white/5 rounded-xl hover:border-white/10 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                                        <Receipt className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-200">{expense.title}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-2">
                                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {expense.category}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {expense.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="font-bold text-slate-100 flex items-center justify-end gap-1">
                                            <DollarSign className="w-4 h-4 text-slate-500" /> {expense.amount}
                                        </div>
                                        <div className="text-xs text-slate-500">{expense.vendor}</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${expense.status === 'Paid'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                        {expense.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Expenses Modal */}
            <Dialog.Root open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-white/10 rounded-2xl p-6 w-[90%] max-w-lg z-50 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <Dialog.Title className="text-xl font-bold text-white">Add New Expense</Dialog.Title>
                            <Dialog.Close className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </Dialog.Close>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Expense Title</label>
                                    <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500/50" placeholder="e.g. Office Rent" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($)</label>
                                    <input type="number" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500/50" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                                    <select className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500/50">
                                        <option>Rent</option>
                                        <option>Utilities</option>
                                        <option>Salaries</option>
                                        <option>Maintenance</option>
                                        <option>Equipment</option>
                                        <option>Software</option>
                                        <option>Marketing</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                                    <input type="date" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500/50" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Vendor / Payee</label>
                                <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500/50" placeholder="Company or Person Name" />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Upload Receipt</label>
                                <div className="border border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-800/50 hover:border-white/20 transition-all cursor-pointer">
                                    <FileText className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-xs">Click to upload image or PDF</span>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => setIsAddExpenseOpen(false)}
                                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-rose-500/20">
                                    Save Expense
                                </button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
