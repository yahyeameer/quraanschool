"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, MessageSquare, Phone } from "lucide-react";

export function TestNotification() {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const sendSMS = useAction(api.actions.notifications.sendSMS);
    const sendWhatsApp = useAction(api.actions.notifications.sendWhatsApp);

    const handleSendSMS = async () => {
        if (!phone) return toast.error("Please enter a phone number");
        setLoading(true);
        try {
            await sendSMS({ to: phone, message: "Test SMS from Al-Maqra'a System" });
            toast.success("SMS Sent Successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to send SMS");
        } finally {
            setLoading(false);
        }
    };

    const handleSendWhatsApp = async () => {
        if (!phone) return toast.error("Please enter a phone number");
        setLoading(true);
        try {
            await sendWhatsApp({ to: `whatsapp:${phone}`, message: "Test WhatsApp from Al-Maqra'a System" });
            toast.success("WhatsApp Sent Successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to send WhatsApp");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="glass-panel border-white/5">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-500" />
                    Test Notifications
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Recipient Phone (E.164 format, e.g. +1234567890)</label>
                    <Input
                        placeholder="+1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleSendSMS}
                        disabled={loading}
                        className="flex-1 bg-sky-600 hover:bg-sky-700"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4 mr-2" />}
                        Test SMS
                    </Button>
                    <Button
                        onClick={handleSendWhatsApp}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4 mr-2" />}
                        Test WhatsApp
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
