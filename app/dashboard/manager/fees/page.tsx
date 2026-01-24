"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, DollarSign, CheckCircle, XCircle, Search, Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
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
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const totalCollected = feesData.reduce((sum, item) => sum + (item.status === 'paid' ? item.amount : 0), 0);
    const pendingCount = feesData.filter(item => item.status === 'unpaid').length;

    return (
        <RoleGuard requiredRole={["manager", "staff"]}>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent italic">
                            Student Fees
                        </h2>
                        <p className="text-muted-foreground mt-1">Manage tuition collection and payment records.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={handleGenerateInvoices}
                            disabled={isGenerating}
                        >
                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            Generate Invoices
                        </Button>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 border border-white/10">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-bold text-white">{selectedMonth}</span>
                        </div>
                    </div>
                </div>

                {/* Overdue Payments Section */}
                <PaymentReminders />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="glass-panel bg-emerald-900/10 border-emerald-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-500">Total Collected</CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-400">${totalCollected.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-panel bg-amber-900/10 border-amber-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-500">Pending Payments</CardTitle>
                            <XCircle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-400">{pendingCount} Students</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="glass-panel border-white/5">
                    <CardHeader>
                        <CardTitle>Fee Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-white/10">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 text-muted-foreground">
                                    <tr>
                                        <th className="h-12 px-4 text-left font-medium">Student</th>
                                        <th className="h-12 px-4 text-left font-medium">Status</th>
                                        <th className="h-12 px-4 text-right font-medium">Amount</th>
                                        <th className="h-12 px-4 text-right font-medium">Date</th>
                                        <th className="h-12 px-4 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feesData.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">No students found.</td>
                                        </tr>
                                    ) : (
                                        feesData.map((record) => (
                                            <tr key={record.student._id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                                                            {record.student.name[0]}
                                                        </div>
                                                        {record.student.name}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'paid'
                                                        ? 'bg-emerald-500/20 text-emerald-500'
                                                        : 'bg-red-500/20 text-red-500'
                                                        }`}>
                                                        {record.status === 'paid' ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-mono text-muted-foreground">
                                                    {record.amount > 0 ? `$${record.amount}` : '-'}
                                                </td>
                                                <td className="p-4 text-right text-muted-foreground">
                                                    {record.paymentDate ? format(new Date(record.paymentDate), 'MMM d, yyyy') : '-'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {record.status === 'unpaid' && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                            onClick={() => {
                                                                setSelectedStudent(record);
                                                                setIsIdModalOpen(true);
                                                            }}
                                                        >
                                                            Record Pay
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Log Payment Modal */}
                <Dialog open={isIdModalOpen} onOpenChange={setIsIdModalOpen}>
                    <DialogContent className="bg-zinc-900 border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Record Payment for {selectedStudent?.student?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Amount ($)</Label>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-black/40 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Month</Label>
                                <Input value={selectedMonth} disabled className="bg-black/40 border-white/10 opacity-50" />
                            </div>
                        </div>
                        <Button onClick={handleLogPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold">
                            Confirm Payment
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
        </RoleGuard>
    );
}
