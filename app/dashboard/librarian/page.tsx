"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleGuard } from "@/components/Auth/RoleGuard";
import { AddBookModal } from "@/components/Library/AddBookModal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Users,
    Search,
    Plus,
    Library,
    Clock,
    AlertCircle,
    CheckCircle,
    ArrowUpRight,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function LibrarianDashboard() {
    const stats = useQuery(api.library.getStats);
    const activeLoans = useQuery(api.library.getActiveLoans);
    const returnBook = useMutation(api.library.returnBook);

    // Catalog Query (Simple search for now inside the dashboard too)
    const [searchTerm, setSearchTerm] = useState("");
    const books = useQuery(api.library.listBooks, { search: searchTerm });

    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <RoleGuard requiredRole="librarian">
            <div className="space-y-8 p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-amiri tracking-tight">Library Command Center</h1>
                        <p className="text-muted-foreground">Manage books, track loans, and expand knowledge.</p>
                    </div>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 px-6 rounded-xl shadow-lg shadow-amber-500/20"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add New Book
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatsCard
                        title="Total Books"
                        value={stats?.totalBooks || 0}
                        icon={Library}
                        color="emerald"
                        subtext={`${stats?.totalCopies || 0} Copies`}
                    />
                    <StatsCard
                        title="Active Loans"
                        value={stats?.activeLoans || 0}
                        icon={BookOpen}
                        color="blue"
                    />
                    <StatsCard
                        title="Overdue"
                        value={stats?.overdueLoans || 0}
                        icon={AlertCircle}
                        color="red"
                    />
                    <StatsCard
                        title="Available"
                        value={stats?.availableCopies || 0}
                        icon={CheckCircle}
                        color="violet"
                    />
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Active Loans Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Clock className="h-5 w-5 text-amber-500" />
                                Recent Activity
                            </h2>
                        </div>

                        <Card className="border-white/10 bg-background/50 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle>Active Loans</CardTitle>
                                <CardDescription>Students currently holding books</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {activeLoans === undefined ? (
                                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                                ) : activeLoans.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">No active loans.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {activeLoans.map((loan) => (
                                            <div key={loan._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                                                        {loan.studentName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{loan.bookTitle}</p>
                                                        <p className="text-sm text-muted-foreground">Borrowed by {loan.studentName} ({format(new Date(loan.borrowDate), 'MMM d')})</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant={new Date(loan.dueDate) < new Date() ? "destructive" : "secondary"}>
                                                        Due {format(new Date(loan.dueDate), 'MMM d')}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 hover:bg-emerald-500/20 hover:text-emerald-500"
                                                        onClick={() => returnBook({ loanId: loan._id })}
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Catalog Search */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Search className="h-5 w-5 text-sky-500" />
                                Catalog Lookup
                            </h2>
                        </div>
                        <Card className="border-white/10 bg-background/50 backdrop-blur-xl h-full">
                            <CardHeader>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search books..."
                                        className="pl-9 bg-black/20 border-white/10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                                {books === undefined ? (
                                    <div className="flex justify-center p-4"><Loader2 className="animate-spin h-5 w-5" /></div>
                                ) : books.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground py-8">No books found matching criteria.</p>
                                ) : (
                                    books.map(book => (
                                        <div key={book._id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex justify-between items-center group">
                                            <div>
                                                <p className="font-medium text-sm truncate max-w-[180px]">{book.title}</p>
                                                <p className="text-xs text-muted-foreground">{book.copiesAvailable} / {book.copiesTotal} available</p>
                                            </div>
                                            {book.copiesAvailable > 0 && (
                                                <Button size="sm" variant="ghost" className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Checkout
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <AddBookModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
            </div>
        </RoleGuard>
    );
}

function StatsCard({ title, value, icon: Icon, color, subtext }: any) {
    return (
        <Card className="border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">{title}</span>
                    <div className={`h-10 w-10 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 text-${color}-500`} />
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : "-"}</h3>
                    {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
                </div>
            </CardContent>
        </Card>
    );
}
