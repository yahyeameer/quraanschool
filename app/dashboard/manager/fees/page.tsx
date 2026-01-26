"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Loader2,
    DollarSign,
    CheckCircle,
    XCircle,
    Search,
    Calendar,
    RefreshCw,
    Sparkles,
    ArrowUpRight,
    Wallet,
    TrendingDown,
    User
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentReminders } from "@/components/Finance/PaymentReminders";

export default function FeesPage() {
    const currentMonthStr = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
    const feesData = useQuery(api.finance.getFees, { month: selectedMonth });
    const logPayment = useMutation(api.finance.logFeePayment);
    const [isIdModalOpen, setIsIdModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [amount, setAmount] = useState("30");
    const generateInvoices = useMutation(api.billing.generateMonthlyPayments);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateInvoices = async () => {
        setIsGenerating(true);
        try {
            const result = await generateInvoices({ month: selectedMonth });
            toast.success(`Generated ${result.generated} invoices for ${selectedMonth}`);
        } catch (error) {
            toast.error("Failed to generate invoices");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLogPayment = async () => {
        if (!selectedStudent) return;
        try {
            await logPayment({
                studentId: selectedStudent.student._id,
                amount: parseFloat(amount),
                month: selectedMonth
            });
            toast.success("Payment recorded successfully");
            setIsIdModalOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to record payment");
        }
    };

    if (feesData === undefined) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#030712]">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-emerald-500 animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-emerald-400 animate-pulse" />
                </div>
            </div>
        );
    }

    const totalCollected = feesData.reduce((sum, item) => sum + (item.status === 'paid' ? item.amount : 0), 0);
    const totalExpected = feesData.reduce((sum, item) => sum + (item.expectedAmount || 0), 0);
    const unpaidBalance = totalExpected - totalCollected;
    const pendingCount = feesData.filter(item => item.status === 'unpaid').length;

    return (
        <RoleGuard requiredRole={["manager", "staff"]}>
            <div className="min-h-screen bg-[#030712] text-zinc-100 p-4 md:p-8 space-y-10 relative overflow-hidden">
                {/* Celestial Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-5xl font-bold font-amiri tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-blue-400">
                            Fiscal Horizons
                        </h2>
                        <p className="text-zinc-400 mt-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-500" />
                            Orchestrating the school's financial vitality and tuition flow.
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            className="bg-zinc-900/50 border-white/10 hover:bg-emerald-500/10 text-emerald-400 rounded-2xl h-12 px-6 backdrop-blur-xl gap-2 transition-all border-dashed"
                            onClick={handleGenerateInvoices}
                            disabled={isGenerating}
                        >
                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            Synchronize Invoices
                        </Button>
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-3xl shadow-2xl">
                            <Calendar className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-bold text-white tracking-widest uppercase">{selectedMonth}</span>
                        </div>
                    </div>
                </div>

                {/* Overdue Payments Section */}
                <PaymentReminders />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Celestial Collection"
                        value={`$${totalCollected.toLocaleString()}`}
                        subtitle="Fulfilled tuition"
                        icon={CheckCircle}
                        gradient="from-emerald-500 to-green-500"
                    />
                    <StatCard
                        title="Projected Orbit"
                        value={`$${totalExpected.toLocaleString()}`}
                        subtitle="Expected revenue"
                        icon={Wallet}
                        gradient="from-blue-500 to-indigo-500"
                    />
                    <StatCard
                        title="Outstanding Nebula"
                        value={`$${unpaidBalance.toLocaleString()}`}
                        subtitle="Pending collection"
                        icon={TrendingDown}
                        gradient="from-red-500 to-rose-500"
                    />
                    <StatCard
                        title="Unlinked Souls"
                        value={pendingCount}
                        subtitle="Pending students"
                        icon={User}
                        gradient="from-amber-500 to-orange-500"
                    />
                </div>

                <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <CardHeader className="bg-white/5 border-b border-white/5 px-8 py-6">
                        <CardTitle className="text-xl font-amiri tracking-widest text-emerald-400">Sphere of Influence: Tuition Records</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
                                    <tr>
                                        <th className="h-14 px-8 text-left font-medium">Scholar</th>
                                        <th className="h-14 px-4 text-left font-medium">Alignment Status</th>
                                        <th className="h-14 px-4 text-right font-medium">Quantum Amount</th>
                                        <th className="h-14 px-4 text-right font-medium">Event Date</th>
                                        <th className="h-14 px-8 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feesData.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-20 text-center text-zinc-600 italic">No celestial beings found in this cycle.</td>
                                        </tr>
                                    ) : (
                                        feesData.map((record, idx) => (
                                            <motion.tr
                                                key={record.student._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="border-t border-white/5 hover:bg-white/5 transition-all group"
                                            >
                                                <td className="p-6 px-8 font-medium">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 font-bold group-hover:scale-110 transition-transform">
                                                            {record.student.name[0]}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-zinc-100 group-hover:text-emerald-400 transition-colors">{record.student.name}</span>
                                                            <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Scholastically Active</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${record.status === 'paid'
                                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500/20'
                                                        : 'bg-rose-500/10 border-rose-500/20 text-rose-500 group-hover:bg-rose-500/20'
                                                        }`}>
                                                        {record.status === 'paid' ? 'Fulfilled' : 'Unbounded'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-mono text-zinc-300">
                                                    {record.amount > 0 ? `$${record.amount.toLocaleString()}` : '-'}
                                                </td>
                                                <td className="p-4 text-right text-zinc-500 text-xs">
                                                    {record.paymentDate ? format(new Date(record.paymentDate), 'MMM d, yyyy') : 'No record'}
                                                </td>
                                                <td className="p-6 px-8 text-right">
                                                    {record.status === 'unpaid' && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/50 rounded-xl px-6 h-10 font-bold tracking-tight transition-all"
                                                            onClick={() => {
                                                                setSelectedStudent(record);
                                                                setIsIdModalOpen(true);
                                                            }}
                                                        >
                                                            Seal Payment
                                                        </Button>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Log Payment Modal */}
                <Dialog open={isIdModalOpen} onOpenChange={setIsIdModalOpen}>
                    <DialogContent className="bg-zinc-900/90 border-white/10 text-white backdrop-blur-2xl rounded-3xl p-0 overflow-hidden max-w-md shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -z-10" />
                        <DialogHeader className="p-8 pb-4">
                            <DialogTitle className="text-3xl font-amiri font-bold text-emerald-400 tracking-tight">Record Alignment</DialogTitle>
                            <p className="text-zinc-500 text-sm">Validating tuition for {selectedStudent?.student?.name}</p>
                        </DialogHeader>
                        <div className="p-8 pt-0 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 uppercase text-[10px] font-bold tracking-widest ml-1">Quantum Amount ($)</Label>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-emerald-500/50 text-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400 uppercase text-[10px] font-bold tracking-widest ml-1">Fiscal Cycle</Label>
                                <Input value={selectedMonth} disabled className="bg-white/5 border-white/5 h-12 rounded-xl opacity-30 text-emerald-500 font-bold" />
                            </div>
                            <Button onClick={handleLogPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-2">
                                <CheckCircle className="h-6 w-6" />
                                Confirm Alignment
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </RoleGuard>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, gradient }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="relative"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 blur-2xl rounded-[2.5rem]`} />
            <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-3xl rounded-[2rem] overflow-hidden h-full relative z-10 hover:border-white/20 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                    <CardTitle className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">{title}</CardTitle>
                    <div className={`p-3 rounded-2xl bg-white/5 text-zinc-200`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="text-4xl font-bold tracking-tighter text-white mb-2">{value}</div>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                        <ArrowUpRight className="h-3 w-3" />
                        {subtitle}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
