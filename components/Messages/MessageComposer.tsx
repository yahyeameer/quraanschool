"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Send, Loader2, User } from "lucide-react";
import { toast } from "sonner";

interface MessageComposerProps {
    onSuccess?: () => void;
    defaultRecipientId?: Id<"users">;
}

export function MessageComposer({ onSuccess, defaultRecipientId }: MessageComposerProps) {
    const [open, setOpen] = useState(false);
    const [recipientId, setRecipientId] = useState<string>(defaultRecipientId || "");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const recipients = useQuery(api.messages.getRecipients);
    const sendMessage = useMutation(api.messages.send);

    const handleSend = async () => {
        if (!recipientId || !message.trim()) {
            toast.error("Please select a recipient and enter a message");
            return;
        }

        setIsLoading(true);
        try {
            await sendMessage({
                recipientId: recipientId as Id<"users">,
                subject: subject.trim() || undefined,
                message: message.trim(),
            });
            toast.success("Message sent successfully!");
            setSubject("");
            setMessage("");
            setRecipientId("");
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Send className="h-4 w-4" />
                    Compose
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                    <DialogDescription>
                        Send a message to a teacher or parent.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="recipient">To</Label>
                        <Select value={recipientId} onValueChange={setRecipientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select recipient..." />
                            </SelectTrigger>
                            <SelectContent>
                                {recipients?.map((r) => (
                                    <SelectItem key={r._id} value={r._id}>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{r.name}</span>
                                            <span className="text-xs text-muted-foreground capitalize">
                                                ({r.role})
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                                {recipients?.length === 0 && (
                                    <SelectItem value="" disabled>
                                        No recipients available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject (optional)</Label>
                        <Input
                            id="subject"
                            placeholder="e.g., Progress Update"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Type your message here..."
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSend} disabled={isLoading || !recipientId || !message.trim()}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
