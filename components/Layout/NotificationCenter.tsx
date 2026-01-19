"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bell, Check, Info, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    // @ts-ignore
    const notifications = useQuery(api.notifications.list);
    // @ts-ignore
    const markAsRead = useMutation(api.notifications.markAsRead);

    const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            case "error": return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-accent transition-colors"
            >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 z-50 w-80 rounded-xl border border-border bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                        >
                            <div className="p-4 border-b border-border bg-accent/5">
                                <h3 className="text-sm font-bold">Notifications</h3>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications?.length === 0 && (
                                    <div className="py-10 text-center text-sm text-muted-foreground">
                                        No notifications yet
                                    </div>
                                )}

                                {notifications?.map((notification: any) => (
                                    <div
                                        key={notification._id}
                                        className={cn(
                                            "flex gap-3 p-4 border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer",
                                            !notification.isRead && "bg-primary/5"
                                        )}
                                        onClick={async () => {
                                            if (!notification.isRead) {
                                                await markAsRead({ notificationId: notification._id });
                                            }
                                            if (notification.link) {
                                                window.location.href = notification.link;
                                            }
                                        }}
                                    >
                                        <div className="shrink-0 mt-1">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={cn("text-xs font-bold", !notification.isRead ? "text-foreground" : "text-muted-foreground")}>
                                                {notification.title}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                                                {notification.message}
                                            </p>
                                            <p className="text-[9px] text-muted-foreground mt-2 uppercase tracking-tighter">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="shrink-0 h-2 w-2 rounded-full bg-primary mt-2" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 border-t border-border bg-accent/5 text-center">
                                <button className="text-[10px] font-bold text-primary uppercase hover:underline">
                                    Clear all
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
