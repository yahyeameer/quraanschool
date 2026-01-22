"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { RoleGuard } from "@/components/Auth/RoleGuard";

export default function ExpensesPage() {
    const expenses = useQuery(api.expenses.listExpenses, {});
    const summary = useQuery(api.expenses.getFinancialSummary);
    const addExpense = useMutation(api.expenses.addExpense);
    const deleteExpense = useMutation(api.expenses.deleteExpense);
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "other",
        date: new Date().toISOString().split("T")[0],
        description: "",
    });

    const handleSubmit = async () => {
        try {
            await addExpense({
                title: formData.title,
                amount: parseFloat(formData.amount),
                category: formData.category,
                date: formData.date,
                description: formData.description,
            });
            toast.success("Expense recorded");
            setIsOpen(false);
            setFormData({ ...formData, title: "", amount: "" });
        } catch (e) {
            toast.error("Failed to add expense");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
            await deleteExpense({ id: id as any });
            toast.success("Expense deleted");
        }
    };

    return (
        <RoleGuard requiredRole="manager">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-amiri text-foreground">Financial Overview</h1>
                        <p className="text-muted-foreground">Track expenses and monitor net profit.</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-600 hover:bg-red-700 text-white">
                                <Plus className="h-4 w-4 mr-2" /> Record Expense
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Record New Expense</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Office Rent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Amount ($)</label>
                                        <Input
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Date</label>
                                        <Input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(val) => setFormData({ ...formData, category: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="salary">Salary</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="utility">Utility</SelectItem>
                                            <SelectItem value="marketing">Marketing</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">
                                    Save Record
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="glass-panel border-emerald-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-400">
                                ${summary?.totalRevenue?.toLocaleString() || "0"}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-panel border-red-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-400">
                                ${summary?.totalExpenses?.toLocaleString() || "0"}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-panel border-white/10 bg-white/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                            <Wallet className="h-4 w-4 text-white" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${(summary?.netProfit || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                                }`}>
                                ${summary?.netProfit?.toLocaleString() || "0"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Expenses List */}
                <Card className="glass-panel border-white/5">
                    <CardHeader>
                        <CardTitle>Recent Expenses</CardTitle>
                        <CardDescription>History of all recorded expenditures.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-white/5 border-white/5">
                                    <TableHead className="text-emerald-500">Date</TableHead>
                                    <TableHead className="text-emerald-500">Title</TableHead>
                                    <TableHead className="text-emerald-500">Category</TableHead>
                                    <TableHead className="text-emerald-500 text-right">Amount</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses?.map((expense) => (
                                    <TableRow key={expense._id} className="hover:bg-white/5 border-white/5">
                                        <TableCell>{expense.date}</TableCell>
                                        <TableCell className="font-medium">{expense.title}</TableCell>
                                        <TableCell>
                                            <span className="capitalize px-2 py-1 rounded-full text-[10px] bg-white/10 border border-white/5">
                                                {expense.category}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-red-400">
                                            -${expense.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(expense._id)}
                                                className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {expenses?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No expenses recorded yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </RoleGuard>
    );
}
