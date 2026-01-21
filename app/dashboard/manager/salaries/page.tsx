"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, DollarSign, Wallet, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function SalariesPage() {
    const currentMonthStr = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
    const salariesData = useQuery(api.finance.getSalaries, { month: selectedMonth });
    const payoutSalary = useMutation(api.finance.payoutSalary);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [amount, setAmount] = useState<string>("");

    const handlePayout = async () => {
        if (!selectedStaff) return;
        try {
            await payoutSalary({
                staffId: selectedStaff.staff._id,
                amount: parseFloat(amount),
                month: selectedMonth
            });
            toast.success("Salary payout recorded successfully");
            setIsModalOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to record payout");
        }
    };

    if (salariesData === undefined) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const totalPayout = salariesData.reduce((sum, item) => sum + (item.status === 'paid' ? item.amount : 0), 0);
    const pendingCount = salariesData.filter(item => item.status === 'pending').length;

    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent italic">
                            Staff Salaries
                        </h2>
                        <p className="text-muted-foreground mt-1">Manage staff payroll and track salary payouts.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-bold text-white">{selectedMonth}</span>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="glass-panel bg-blue-900/10 border-blue-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-500">Total Payout</CardTitle>
                            <DollarSign className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-400">${totalPayout.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-panel bg-amber-900/10 border-amber-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-500">Pending Payouts</CardTitle>
                            <Wallet className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-400">{pendingCount} Staff</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="glass-panel border-white/5">
                    <CardHeader>
                        <CardTitle>Payroll List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-white/10">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 text-muted-foreground">
                                    <tr>
                                        <th className="h-12 px-4 text-left font-medium">Staff Member</th>
                                        <th className="h-12 px-4 text-left font-medium">Role</th>
                                        <th className="h-12 px-4 text-left font-medium">Status</th>
                                        <th className="h-12 px-4 text-right font-medium">Amount</th>
                                        <th className="h-12 px-4 text-right font-medium">Date</th>
                                        <th className="h-12 px-4 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salariesData.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">No eligible staff found.</td>
                                        </tr>
                                    ) : (
                                        salariesData.map((record) => (
                                            <tr key={record.staff._id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
                                                            {record.staff.name[0]}
                                                        </div>
                                                        {record.staff.name}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-muted-foreground capitalize">{record.staff.role}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'paid'
                                                            ? 'bg-blue-500/20 text-blue-500'
                                                            : 'bg-amber-500/20 text-amber-500'
                                                        }`}>
                                                        {record.status === 'paid' ? 'Paid' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-mono text-muted-foreground">
                                                    {record.amount > 0 ? `$${record.amount}` : '-'}
                                                </td>
                                                <td className="p-4 text-right text-muted-foreground">
                                                    {record.paymentDate ? format(new Date(record.paymentDate), 'MMM d, yyyy') : '-'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {record.status === 'pending' && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                            onClick={() => {
                                                                setSelectedStaff(record);
                                                                setAmount("");
                                                                setIsModalOpen(true);
                                                            }}
                                                        >
                                                            Process Payout
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

                {/* Payout Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="bg-zinc-900 border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Process Payout for {selectedStaff?.staff?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Salary Amount ($)</Label>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="e.g. 2500"
                                    className="bg-black/40 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Month</Label>
                                <Input value={selectedMonth} disabled className="bg-black/40 border-white/10 opacity-50" />
                            </div>
                        </div>
                        <Button
                            onClick={handlePayout}
                            disabled={!amount}
                            className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
                        >
                            Confirm Transfer
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
        </RoleGuard>
    );
}
