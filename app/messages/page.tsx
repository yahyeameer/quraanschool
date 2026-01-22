"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageComposer } from "@/components/Messages/MessageComposer";
import { MessageList } from "@/components/Messages/MessageList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Inbox, Send, ArrowLeft, User, Clock, Megaphone, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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
    recipientName?: string;
}

export default function MessagesPage() {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [activeTab, setActiveTab] = useState("inbox");

    const inbox = useQuery(api.messages.listInbox);
    const sent = useQuery(api.messages.listSent);
    const unreadCount = useQuery(api.messages.getUnreadCount);
    const currentUser = useQuery(api.users.currentUser);

    const isLoading = inbox === undefined || sent === undefined;

    return (
        <div className="container max-w-6xl py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground">
                        Communicate with teachers and parents
                    </p>
                </div>
                <MessageComposer />
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Sidebar - Message List */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="inbox" className="gap-2">
                                    <Inbox className="h-4 w-4" />
                                    Inbox
                                    {unreadCount !== undefined && unreadCount > 0 && (
                                        <span className="ml-1 h-5 w-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="sent" className="gap-2">
                                    <Send className="h-4 w-4" />
                                    Sent
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <>
                                {activeTab === "inbox" && (
                                    <MessageList
                                        messages={inbox || []}
                                        type="inbox"
                                        onSelect={(msg) => setSelectedMessage(msg)}
                                        selectedId={selectedMessage?._id}
                                    />
                                )}
                                {activeTab === "sent" && (
                                    <MessageList
                                        messages={sent || []}
                                        type="sent"
                                        onSelect={(msg) => setSelectedMessage(msg)}
                                        selectedId={selectedMessage?._id}
                                    />
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Message Detail */}
                <Card className="lg:col-span-3 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {selectedMessage ? (
                            <motion.div
                                key={selectedMessage._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="h-full"
                            >
                                <CardHeader className="border-b">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="lg:hidden"
                                                onClick={() => setSelectedMessage(null)}
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                            </Button>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {selectedMessage.subject || "(No subject)"}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                    {selectedMessage.type === "announcement" && (
                                                        <span className="flex items-center gap-1 text-amber-600">
                                                            <Megaphone className="h-3 w-3" />
                                                            Announcement
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {/* Sender/Recipient Info */}
                                    <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                            <User className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {activeTab === "inbox"
                                                    ? `From: ${selectedMessage.senderName}`
                                                    : `To: ${selectedMessage.recipientName}`}
                                            </p>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {formatDistanceToNow(new Date(selectedMessage.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Body */}
                                    <div className="prose prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                                    </div>

                                    {/* Reply Button (for inbox) */}
                                    {activeTab === "inbox" && (
                                        <div className="mt-8 pt-4 border-t">
                                            <MessageComposer
                                                defaultRecipientId={selectedMessage.senderId}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground"
                            >
                                <Inbox className="h-16 w-16 mb-4 opacity-20" />
                                <p className="text-lg font-medium">No message selected</p>
                                <p className="text-sm">Choose a message from the list to view</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </div>
        </div>
    );
}
