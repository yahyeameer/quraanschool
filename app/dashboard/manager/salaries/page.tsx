"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Plus, DollarSign, Calendar, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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

    return (
        <div className="p-8 space-y-8 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-amiri tracking-tight">Financial Command Center</h1>
                    <p className="text-muted-foreground">Manage contracts, payroll, and payouts.</p>
                </div>
                <div className="flex gap-4">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2026-01">January 2026</SelectItem>
                            <SelectItem value="2026-02">February 2026</SelectItem>
                            <SelectItem value="2026-03">March 2026</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setIsManualModalOpen(true)} variant="outline">
                        Record Salary Payout
                    </Button>
                    <Button onClick={handleGenerate} disabled={isGenerating} className="bg-emerald-600 hover:bg-emerald-700">
                        {isGenerating ? "Generating..." : "Generate Payroll"}
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <StatCard
                    title="Confirmed (Paid)"
                    value={`$${totalPaid.toLocaleString()}`}
                    icon={CheckCircle}
                    color="text-emerald-500"
                />
                <StatCard
                    title="Pending (Approved)"
                    value={`$${totalApproved.toLocaleString()}`}
                    icon={Clock}
                    color="text-blue-500"
                />
                <StatCard
                    title="Not Confirmed (Draft)"
                    value={`$${totalDraft.toLocaleString()}`}
                    icon={DollarSign}
                    color="text-amber-500"
                />
            </div>

            {/* Manual Payout Modal */}
            <Dialog open={isManualModalOpen} onOpenChange={setIsManualModalOpen}>
                <DialogContent className="bg-slate-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Record Manual Payout</DialogTitle>
                        <DialogDescription>Enter payment details for any staff member.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Staff Member</Label>
                            <Select value={manualStaffId} onValueChange={setManualStaffId}>
                                <SelectTrigger className="bg-black/20 border-white/10">
                                    <SelectValue placeholder="Select Staff" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/10 text-white">
                                    {staffList?.map((s: any) => (
                                        <SelectItem key={s._id} value={s._id}>{s.name} ({s.role})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Amount ($)</Label>
                            <Input
                                type="number"
                                value={manualAmount}
                                onChange={(e) => setManualAmount(e.target.value)}
                                className="bg-black/20 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={manualStatus} onValueChange={setManualStatus}>
                                <SelectTrigger className="bg-black/20 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/10 text-white">
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleManualSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            Confirm Record
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <CardTitle>Payroll: {format(new Date(selectedMonth), "MMMM yyyy")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Base Salary</TableHead>
                                <TableHead>Adjustments</TableHead>
                                <TableHead>Net Pay</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salaries?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                        No payroll generated for this month yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {salaries?.map((salary) => (
                                <TableRow key={salary._id}>
                                    <TableCell className="font-medium">{salary.staffName}</TableCell>
                                    <TableCell>{salary.staffRole}</TableCell>
                                    <TableCell>${salary.baseAmount.toLocaleString()}</TableCell>
                                    <TableCell className={salary.adjustments >= 0 ? "text-emerald-600" : "text-red-600"}>
                                        {salary.adjustments > 0 ? "+" : ""}{salary.adjustments}
                                    </TableCell>
                                    <TableCell className="font-bold">${salary.totalAmount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge status={salary.status} />
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {salary.status === "draft" && (
                                            <Button size="sm" variant="outline" onClick={() => handleApprove(salary._id)}>
                                                Approve
                                            </Button>
                                        )}
                                        {salary.status === "approved" && (
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handlePay(salary._id)}>
                                                Mark Paid
                                            </Button>
                                        )}
                                        {salary.status === "paid" && (
                                            <span className="text-xs text-muted-foreground">Paid on {new Date(salary.paymentDate!).toLocaleDateString()}</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-full ${color.replace("text-", "bg-")}/10 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </CardContent>
        </Card>
    );
}

function Badge({ status }: { status: string }) {
    const styles: any = {
        draft: "bg-slate-100 text-slate-600",
        approved: "bg-blue-100 text-blue-600",
        paid: "bg-emerald-100 text-emerald-600",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status] || styles.draft}`}>
            {status}
        </span>
    );
}
