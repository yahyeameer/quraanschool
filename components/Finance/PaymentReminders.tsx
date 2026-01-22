"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Bell,
    Check,
    Clock,
    AlertTriangle,
    Mail,
    Loader2,
    RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function PaymentReminders() {
    const overduePayments = useQuery(api.billing.getOverduePayments);
    const sendReminder = useMutation(api.billing.sendPaymentReminder);
    const [loadingId, setLoadingId] = useState<Id<"payments"> | null>(null);

    const handleSendReminder = async (paymentId: Id<"payments">) => {
        setLoadingId(paymentId);
        try {
            await sendReminder({ paymentId });
            toast.success("Reminder sent successfully");
        } catch (error) {
            toast.error("Failed to send reminder");
        } finally {
            setLoadingId(null);
        }
    };

    if (overduePayments === undefined) {
        return (
            <Card className="glass-panel border-amber-500/20">
                <CardContent className="py-8 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-panel border-amber-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bell className="h-24 w-24 text-amber-500" />
            </div>

            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-amber-500">Overdue Payments</CardTitle>
                </div>
                <CardDescription>
                    {overduePayments.length} students have pending tuition fees.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {overduePayments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Check className="h-10 w-10 mb-2 text-emerald-500" />
                        <p>All clear! No overdue payments found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {overduePayments.map((payment) => (
                            <div
                                key={payment._id}
                                className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{payment.studentName}</span>
                                        <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                                            ${payment.amount}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        <span>{payment.month}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Pending since {new Date(payment.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {payment.parentName && (
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Parent: {payment.parentName}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-2 border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
                                    onClick={() => handleSendReminder(payment._id)}
                                    disabled={loadingId === payment._id}
                                >
                                    {loadingId === payment._id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <Mail className="h-3 w-3" />
                                    )}
                                    Remind
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
