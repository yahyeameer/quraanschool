"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    DollarSign,
    Calendar,
    CheckCircle,
    Clock,
    Sparkles,
    RefreshCw,
    User,
    Wallet,
    ArrowUpRight,
    TrendingUp,
    Zap,
    Scale,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function SalariesPage() {
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
    const salaries = useQuery(api.salaries.getSalaries, { month: selectedMonth });
    const contracts = useQuery(api.salaries.getContracts);
    const generatePayroll = useMutation(api.salaries.generateMonthlyPayroll);
    const approveSalary = useMutation(api.salaries.approveSalary);
    const markAsPaid = useMutation(api.salaries.markAsPaid);

    const [isGenerating, setIsGenerating] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [manualStaffId, setManualStaffId] = useState<string>("");
    const [manualAmount, setManualAmount] = useState<string>("");
    const [manualStatus, setManualStatus] = useState<string>("paid");
    const staffList = useQuery(api.salaries.listStaff);
    const recordManualPayout = useMutation(api.salaries.recordManualPayout);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const count = await generatePayroll({ month: selectedMonth });
            toast.success(`Generated payroll for ${count} staff members.`);
        } catch (error) {
            toast.error("Failed to generate payroll.");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleManualSubmit = async () => {
        if (!manualStaffId || !manualAmount) {
            toast.error("Please fill in all fields.");
            return;
        }
        try {
            await recordManualPayout({
                staffId: manualStaffId as Id<"users">,
                amount: parseFloat(manualAmount),
                month: selectedMonth,
                paymentDate: new Date().toISOString(),
                status: manualStatus
            });
            toast.success("Salary payout recorded.");
            setIsManualModalOpen(false);
            setManualStaffId("");
            setManualAmount("");
        } catch (error) {
            toast.error("Failed to record payout.");
        }
    };

    const handleApprove = async (id: any) => {
        await approveSalary({ salaryId: id });
        toast.success("Salary approved.");
    };

    const handlePay = async (id: any) => {
        await markAsPaid({ salaryId: id, paymentDate: new Date().toISOString() });
        toast.success("Salary marked as paid.");
    };

    // Calculate Totals by Status
    const totalPaid = salaries?.filter(s => s.status === "paid").reduce((acc, s) => acc + s.totalAmount, 0) || 0;
    const totalApproved = salaries?.filter(s => s.status === "approved").reduce((acc, s) => acc + s.totalAmount, 0) || 0;
    const totalDraft = salaries?.filter(s => s.status === "draft").reduce((acc, s) => acc + s.totalAmount, 0) || 0;

    if (salaries === undefined || staffList === undefined) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#030712]">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-blue-400 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712] text-zinc-100 p-4 md:p-8 space-y-10 relative overflow-hidden">
            {/* Celestial Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-5xl font-bold font-amiri tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400">
                        Financial Command
                    </h1>
                    <p className="text-zinc-400 mt-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-400" />
                        Overseeing staff rewards and institutional compensation logic.
                    </p>
                </motion.div>

                <div className="flex flex-wrap gap-3">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="bg-zinc-900/50 border-white/10 w-[180px] h-12 rounded-2xl backdrop-blur-xl">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            <SelectItem value="2026-01">January 2026</SelectItem>
                            <SelectItem value="2026-02">February 2026</SelectItem>
                            <SelectItem value="2026-03">March 2026</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={() => setIsManualModalOpen(true)}
                        variant="outline"
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-zinc-200 rounded-2xl h-12 px-6 backdrop-blur-xl border-dashed"
                    >
                        Manual Payout
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 px-8 font-bold shadow-xl shadow-blue-900/20"
                    >
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        Generate Payroll
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    title="Fulfilled (Paid)"
                    value={`$${totalPaid.toLocaleString()}`}
                    subtitle="Confirmed disbursements"
                    icon={CheckCircle}
                    gradient="from-emerald-500 to-teal-500"
                />
                <StatCard
                    title="Sanctioned (Approved)"
                    value={`$${totalApproved.toLocaleString()}`}
                    subtitle="Pending release"
                    icon={Clock}
                    gradient="from-blue-500 to-indigo-500"
                />
                <StatCard
                    title="Formulating (Draft)"
                    value={`$${totalDraft.toLocaleString()}`}
                    subtitle="Initial estimations"
                    icon={Scale}
                    gradient="from-amber-500 to-orange-500"
                />
            </div>

            {/* Main Table Card */}
            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="bg-white/5 border-b border-white/5 px-8 py-6">
                    <CardTitle className="text-xl font-amiri tracking-widest text-blue-400 uppercase">
                        Payroll Registry: {format(new Date(selectedMonth), "MMMM yyyy")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white/5 text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
                                <tr>
                                    <th className="h-14 px-8 text-left font-medium">Scholar-Staff</th>
                                    <th className="h-14 px-4 text-left font-medium">Domain</th>
                                    <th className="h-14 px-4 text-right font-medium">Base Compensation</th>
                                    <th className="h-14 px-4 text-right font-medium">Adjustments</th>
                                    <th className="h-14 px-4 text-right font-medium">Net Payout</th>
                                    <th className="h-14 px-4 text-center font-medium">Status</th>
                                    <th className="h-14 px-8 text-right font-medium">Executive Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaries?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center text-zinc-600 italic">No payroll manifests generated for this orbital cycle.</td>
                                    </tr>
                                ) : (
                                    salaries?.map((salary, idx) => (
                                        <motion.tr
                                            key={salary._id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-t border-white/5 hover:bg-white/5 transition-all group"
                                        >
                                            <td className="p-6 px-8 font-medium">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-blue-400 font-bold group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                                                        {salary.staffName[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-zinc-100 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{salary.staffName}</span>
                                                        <span className="text-[10px] text-zinc-500 font-mono tracking-tighter capitalize">{salary.staffRole}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-zinc-500 text-xs uppercase tracking-widest">{salary.staffRole}</td>
                                            <td className="p-4 text-right font-mono text-zinc-400">${salary.baseAmount.toLocaleString()}</td>
                                            <td className={cn("p-4 text-right font-mono text-sm", salary.adjustments >= 0 ? "text-emerald-500" : "text-rose-500")}>
                                                {salary.adjustments > 0 ? "+" : ""}{salary.adjustments.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="text-lg font-bold text-white tracking-tighter">${salary.totalAmount.toLocaleString()}</span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <StatusBadge status={salary.status} />
                                            </td>
                                            <td className="p-6 px-8 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {salary.status === "draft" && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleApprove(salary._id)}
                                                            className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-blue-500/30 rounded-xl px-5 h-9 font-bold"
                                                        >
                                                            Approve
                                                        </Button>
                                                    )}
                                                    {salary.status === "approved" && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl px-5 h-9 font-bold shadow-lg shadow-emerald-500/10"
                                                            onClick={() => handlePay(salary._id)}
                                                        >
                                                            Release Payout
                                                        </Button>
                                                    )}
                                                    {salary.status === "paid" && (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] text-emerald-500/80 uppercase font-black tracking-widest">TRANSACTION SEALED</span>
                                                            <span className="text-[10px] text-zinc-500">{format(new Date(salary.paymentDate!), 'MMM d, yyyy')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Manual Payout Modal */}
            <Dialog open={isManualModalOpen} onOpenChange={setIsManualModalOpen}>
                <DialogContent className="bg-zinc-900/90 border-white/10 text-white backdrop-blur-2xl rounded-[2.5rem] p-0 overflow-hidden shadow-2xl max-w-lg">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
                    <DialogHeader className="p-10 pb-4">
                        <DialogTitle className="text-3xl font-amiri font-bold text-blue-400 tracking-tight">Manual Disbursement</DialogTitle>
                        <DialogDescription className="text-zinc-500">Record ad-hoc compensation for staff members.</DialogDescription>
                    </DialogHeader>
                    <div className="p-10 pt-0 space-y-6">
                        <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500 ml-1">Recipient Staff</Label>
                            <Select value={manualStaffId} onValueChange={setManualStaffId}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-blue-500/50">
                                    <SelectValue placeholder="Select Domain Official" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-white/10 text-white">
                                    {staffList?.map((s: any) => (
                                        <SelectItem key={s._id} value={s._id.toString()}>{s.name} ({s.role})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500 ml-1">Quantum Amount ($)</Label>
                                <Input
                                    type="number"
                                    value={manualAmount}
                                    onChange={(e) => setManualAmount(e.target.value)}
                                    className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-blue-500/50 text-xl font-bold"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500 ml-1">Alignment Status</Label>
                                <Select value={manualStatus} onValueChange={setManualStatus}>
                                    <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-blue-500/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-white/10 text-white">
                                        <SelectItem value="draft">Initial Draft</SelectItem>
                                        <SelectItem value="approved">Sanctioned</SelectItem>
                                        <SelectItem value="paid">Manifested (Paid)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={handleManualSubmit} className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/40 mt-4 transition-all flex items-center justify-center gap-3">
                            <Zap className="h-6 w-6" />
                            Seal Disbursement
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, gradient }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="relative"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 blur-2xl rounded-[2.5rem]`} />
            <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-3xl rounded-[2.2rem] overflow-hidden h-full relative z-10 hover:border-white/20 transition-all border shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-8">
                    <CardTitle className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">{title}</CardTitle>
                    <div className={`p-4 rounded-2xl bg-white/5 text-zinc-200 border border-white/5`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <div className="text-4xl font-bold tracking-tighter text-white mb-2">{value}</div>
                    <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                        <ArrowUpRight className="h-3 w-3" />
                        {subtitle}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: any = {
        draft: { label: "Draft", class: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
        approved: { label: "Approved", class: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
        paid: { label: "Manifested", class: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    };
    const config = configs[status] || configs.draft;
    return (
        <span className={cn("inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all", config.class)}>
            <div className={cn("w-1.5 h-1.5 rounded-full mr-2 animate-pulse", config.class.split(" ")[1].replace("text-", "bg-"))} />
            {config.label}
        </span>
    );
}
