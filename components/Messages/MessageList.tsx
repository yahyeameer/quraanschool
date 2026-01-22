"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { Mail, MailOpen, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
    _id: Id<"messages">;
    senderId: Id<"users">;
    recipientId: Id<"users">;
    subject?: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type: string;
    senderName?: string;
    senderAvatar?: string;
    recipientName?: string;
    recipientAvatar?: string;
}

interface MessageListProps {
    messages: Message[];
    type: "inbox" | "sent";
    onSelect?: (message: Message) => void;
    selectedId?: Id<"messages">;
}

export function MessageList({ messages, type, onSelect, selectedId }: MessageListProps) {
    const markAsRead = useMutation(api.messages.markAsRead);
    const deleteMessage = useMutation(api.messages.deleteMessage);

    const handleClick = async (message: Message) => {
        if (type === "inbox" && !message.isRead) {
            try {
                await markAsRead({ messageId: message._id });
            } catch (error) {
                console.error("Failed to mark as read:", error);
            }
        }
        onSelect?.(message);
    };

    const handleDelete = async (e: React.MouseEvent, messageId: Id<"messages">) => {
        e.stopPropagation();
        try {
            await deleteMessage({ messageId });
            toast.success("Message deleted");
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-sm">No messages yet</p>
            </div>
        );
    }

    return (
        <div className="divide-y">
            {messages.map((message) => (
                <div
                    key={message._id}
                    onClick={() => handleClick(message)}
                    className={cn(
                        "flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-muted/50",
                        selectedId === message._id && "bg-muted",
                        type === "inbox" && !message.isRead && "bg-primary/5"
                    )}
                >
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                {type === "inbox" && !message.isRead && (
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                )}
                                <span className={cn(
                                    "font-medium truncate",
                                    type === "inbox" && !message.isRead && "font-semibold"
                                )}>
                                    {type === "inbox" ? message.senderName : message.recipientName}
                                </span>
                                {message.type === "announcement" && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 uppercase font-bold">
                                        Announcement
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </span>
                        </div>

                        {message.subject && (
                            <p className={cn(
                                "text-sm truncate",
                                type === "inbox" && !message.isRead ? "font-medium" : "text-foreground"
                            )}>
                                {message.subject}
                            </p>
                        )}

                        <p className="text-sm text-muted-foreground truncate">
                            {message.message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                        {type === "inbox" && (
                            message.isRead ? (
                                <MailOpen className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Mail className="h-4 w-4 text-primary" />
                            )
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={(e) => handleDelete(e, message._id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
