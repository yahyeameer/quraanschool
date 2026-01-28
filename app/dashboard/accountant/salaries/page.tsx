"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Users,
    DollarSign,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    MoreHorizontal
} from "lucide-react";

// Mock Payroll Data
const staffPayroll = [
    { id: 1, name: "Sheikh Abdullah", role: "Head Teacher", baseSalary: 1500, adjustments: 200, net: 1700, status: "Processed" },
    { id: 2, name: "Ustadha Maryam", role: "Quran Teacher", baseSalary: 1200, adjustments: 0, net: 1200, status: "Pending" },
    { id: 3, name: "Ahmed Yasin", role: "Bus Driver", baseSalary: 800, adjustments: -50, net: 750, status: "Paid" },
    { id: 4, name: "Fatima Noor", role: "Admin Staff", baseSalary: 900, adjustments: 0, net: 900, status: "Pending" },
    { id: 5, name: "Hassan Ali", role: "Security", baseSalary: 600, adjustments: 50, net: 650, status: "Processed" },
];

export default function PayrollPage() {
    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-8 font-sans text-slate-100 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[30%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Payroll Management</h1>
                        <p className="text-slate-400 mt-1">Manage staff salaries, bonuses, and monthly payouts.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-slate-900/50 border border-white/10 px-4 py-2 rounded-lg text-sm text-slate-300">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            Current Period: <span className="text-white font-medium">March 2024</span>
                        </div>
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            Run Payroll
                        </button>
                    </div>
                </div>

                {/* Payroll Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign className="w-20 h-20 text-emerald-400" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-sm text-emerald-400 font-medium mb-1">Total Payroll</div>
                            <div className="text-3xl font-bold text-white">$5,200.00</div>
                            <div className="text-xs text-slate-400 mt-1">For 12 Active Staff</div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Clock className="w-20 h-20 text-amber-400" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-sm text-amber-400 font-medium mb-1">Pending Processing</div>
                            <div className="text-3xl font-bold text-white">$2,100.00</div>
                            <div className="text-xs text-slate-400 mt-1">5 Staff members</div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircle className="w-20 h-20 text-blue-400" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-sm text-blue-400 font-medium mb-1">Last Payout</div>
                            <div className="text-3xl font-bold text-white">Feb 28, 2024</div>
                            <div className="text-xs text-slate-400 mt-1">Successfully completed</div>
                        </div>
                    </div>
                </div>

                {/* Staff Table */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b border-white/5">
                        <h3 className="text-lg font-semibold text-slate-200">Staff Payroll List</h3>
                        <button className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/30 text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                                <th className="p-4 pl-6 font-medium">Staff Member</th>
                                <th className="p-4 font-medium text-right">Base Salary</th>
                                <th className="p-4 font-medium text-right">Adjustments</th>
                                <th className="p-4 font-medium text-right">Net Payable</th>
                                <th className="p-4 font-medium text-center">Status</th>
                                <th className="p-4 pr-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-white/5">
                            {staffPayroll.map((staff) => (
                                <tr key={staff.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                {staff.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-100">{staff.name}</div>
                                                <div className="text-xs text-slate-500">{staff.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-slate-300">${staff.baseSalary.toLocaleString()}</td>
                                    <td className={`p-4 text-right font-medium ${staff.adjustments >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {staff.adjustments > 0 ? '+' : ''}{staff.adjustments}
                                    </td>
                                    <td className="p-4 text-right font-bold text-emerald-300">
                                        ${staff.net.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${staff.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                staff.status === 'Processed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {staff.status}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md text-slate-300 transition-colors">
                                                Slip
                                            </button>
                                            <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
