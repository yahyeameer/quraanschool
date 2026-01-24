"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Send, MessageSquare, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactAdminModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const sendMessage = useMutation(api.messages.send);
    const recipients = useQuery(api.messages.getRecipients);

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [adminRecipient, setAdminRecipient] = useState<any>(null);

    // Find an admin or manager to send to
    useEffect(() => {
        if (recipients) {
            const admin = recipients.find(r => r.role === "admin" || r.role === "manager");
            setAdminRecipient(admin);
        }
    }, [recipients]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminRecipient) {
            toast.error("No administration contact found.");
            return;
        }

        setIsLoading(true);
        try {
            await sendMessage({
                recipientId: adminRecipient._id,
                subject: subject,
                message: message,
            });
            toast.success("Message sent to administration successfully!");
            setSubject("");
            setMessage("");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to send message");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg overflow-hidden bg-background border border-border/50 rounded-3xl shadow-2xl p-6"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-purple-500/20 text-purple-600">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">Contact Administration</h3>
                            <p className="text-sm text-muted-foreground">Send a direct message to school management</p>
                        </div>
                    </div>

                    {!adminRecipient && recipients !== undefined ? (
                        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm mb-4">
                            System could not find an available administrator. Please try again later or contact via email.
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g., Question about tuition fee"
                                required
                                className="bg-muted/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="min-h-[120px] bg-muted/50 resize-none"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading || !adminRecipient}
                                className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                    <Send className="h-5 w-5 mr-2" />
                                )}
                                Send Message
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
