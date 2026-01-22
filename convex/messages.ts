import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Send a new message
export const send = mutation({
    args: {
        recipientId: v.id("users"),
        subject: v.optional(v.string()),
        message: v.string(),
        type: v.optional(v.string()),
        classId: v.optional(v.id("classes")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const sender = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!sender) throw new Error("User not found");

        // Verify recipient exists
        const recipient = await ctx.db.get(args.recipientId);
        if (!recipient) throw new Error("Recipient not found");

        const messageId = await ctx.db.insert("messages", {
            senderId: sender._id,
            recipientId: args.recipientId,
            subject: args.subject,
            message: args.message,
            isRead: false,
            createdAt: new Date().toISOString(),
            type: args.type || "direct",
            classId: args.classId,
        });

        // Create notification for recipient
        await ctx.db.insert("notifications", {
            userId: args.recipientId,
            title: "New Message",
            message: `${sender.name} sent you a message${args.subject ? `: ${args.subject}` : ""}`,
            type: "info",
            isRead: false,
            link: "/messages",
            createdAt: new Date().toISOString(),
        });

        return messageId;
    },
});

// Get inbox messages for current user
export const listInbox = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return [];

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_recipient", (q) => q.eq("recipientId", user._id))
            .order("desc")
            .collect();

        // Enrich with sender info
        const enriched = await Promise.all(
            messages.map(async (msg) => {
                const sender = await ctx.db.get(msg.senderId);
                return {
                    ...msg,
                    senderName: sender?.name || "Unknown",
                    senderAvatar: sender?.avatarUrl,
                };
            })
        );

        return enriched;
    },
});

// Get sent messages for current user
export const listSent = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return [];

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_sender", (q) => q.eq("senderId", user._id))
            .order("desc")
            .collect();

        // Enrich with recipient info
        const enriched = await Promise.all(
            messages.map(async (msg) => {
                const recipient = await ctx.db.get(msg.recipientId);
                return {
                    ...msg,
                    recipientName: recipient?.name || "Unknown",
                    recipientAvatar: recipient?.avatarUrl,
                };
            })
        );

        return enriched;
    },
});

// Mark message as read
export const markAsRead = mutation({
    args: { messageId: v.id("messages") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const message = await ctx.db.get(args.messageId);
        if (!message) throw new Error("Message not found");

        // Only recipient can mark as read
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || message.recipientId !== user._id) {
            throw new Error("Cannot mark this message as read");
        }

        await ctx.db.patch(args.messageId, { isRead: true });
    },
});

// Get unread message count
export const getUnreadCount = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return 0;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return 0;

        const unreadMessages = await ctx.db
            .query("messages")
            .withIndex("by_recipient", (q) => q.eq("recipientId", user._id))
            .filter((q) => q.eq(q.field("isRead"), false))
            .collect();

        return unreadMessages.length;
    },
});

// Delete a message
export const deleteMessage = mutation({
    args: { messageId: v.id("messages") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const message = await ctx.db.get(args.messageId);
        if (!message) throw new Error("Message not found");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        // Only sender or recipient can delete
        if (!user || (message.senderId !== user._id && message.recipientId !== user._id)) {
            throw new Error("Cannot delete this message");
        }

        await ctx.db.delete(args.messageId);
    },
});

// Get available recipients (teachers for parents, parents for teachers)
export const getRecipients = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return [];

        // Teachers can message parents, parents can message teachers, managers can message everyone
        let recipients: any[] = [];

        if (user.role === "teacher") {
            // Get parents of students in teacher's classes
            const classes = await ctx.db
                .query("classes")
                .filter((q) => q.eq(q.field("teacherId"), user._id))
                .collect();

            for (const cls of classes) {
                const enrollments = await ctx.db
                    .query("enrollments")
                    .withIndex("by_class", (q) => q.eq("classId", cls._id))
                    .collect();

                for (const enrollment of enrollments) {
                    const student = await ctx.db.get(enrollment.studentId);
                    if (student?.parentId) {
                        const parent = await ctx.db.get(student.parentId);
                        if (parent && !recipients.find((r) => r._id === parent._id)) {
                            recipients.push({
                                _id: parent._id,
                                name: parent.name,
                                role: parent.role,
                                avatarUrl: parent.avatarUrl,
                                studentName: student.name,
                            });
                        }
                    }
                }
            }
        } else if (user.role === "parent") {
            // Get teachers of children's classes
            const children = await ctx.db
                .query("users")
                .withIndex("by_parent", (q) => q.eq("parentId", user._id))
                .collect();

            for (const child of children) {
                const enrollments = await ctx.db
                    .query("enrollments")
                    .withIndex("by_student", (q) => q.eq("studentId", child._id))
                    .collect();

                for (const enrollment of enrollments) {
                    const cls = await ctx.db.get(enrollment.classId);
                    if (cls) {
                        const teacher = await ctx.db.get(cls.teacherId);
                        if (teacher && !recipients.find((r) => r._id === teacher._id)) {
                            recipients.push({
                                _id: teacher._id,
                                name: teacher.name,
                                role: teacher.role,
                                avatarUrl: teacher.avatarUrl,
                                className: cls.name,
                            });
                        }
                    }
                }
            }
        } else if (user.role === "manager" || user.role === "admin") {
            // Can message all teachers and parents
            const allUsers = await ctx.db.query("users").collect();
            recipients = allUsers
                .filter((u) => u._id !== user._id && ["teacher", "parent", "staff"].includes(u.role))
                .map((u) => ({
                    _id: u._id,
                    name: u.name,
                    role: u.role,
                    avatarUrl: u.avatarUrl,
                }));
        }

        return recipients;
    },
});

// Send announcement to all parents (manager only)
export const sendAnnouncement = mutation({
    args: {
        subject: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || (user.role !== "manager" && user.role !== "admin")) {
            throw new Error("Only managers can send announcements");
        }

        // Get all parents
        const parents = await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", "parent"))
            .collect();

        // Send message to each parent
        for (const parent of parents) {
            await ctx.db.insert("messages", {
                senderId: user._id,
                recipientId: parent._id,
                subject: args.subject,
                message: args.message,
                isRead: false,
                createdAt: new Date().toISOString(),
                type: "announcement",
            });

            // Notification
            await ctx.db.insert("notifications", {
                userId: parent._id,
                title: "📢 New Announcement",
                message: args.subject,
                type: "info",
                isRead: false,
                link: "/messages",
                createdAt: new Date().toISOString(),
            });
        }

        return { sent: parents.length };
    },
});
