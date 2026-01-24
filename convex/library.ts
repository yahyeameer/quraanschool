import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasAnyRole } from "./permissions";

// --- Book Management ---

export const listBooks = query({
    args: {
        search: v.optional(v.string()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("books");

        if (args.category) {
            q = q.withIndex("by_category", (q) => q.eq("category", args.category));
        }

        const books = await q.collect();

        if (args.search) {
            const searchLower = args.search.toLowerCase();
            return books.filter(b =>
                b.title.toLowerCase().includes(searchLower) ||
                b.author.toLowerCase().includes(searchLower)
            );
        }

        return books;
    }
});

export const getBook = query({
    args: { id: v.id("books") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    }
});

export const addBook = mutation({
    args: {
        title: v.string(),
        author: v.string(),
        isbn: v.optional(v.string()),
        category: v.string(),
        copiesTotal: v.number(),
        coverUrl: v.optional(v.string()),
        description: v.optional(v.string()),
        location: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { hasRole, user } = await hasAnyRole(ctx, ["admin", "librarian", "manager"]);
        if (!hasRole || !user) throw new Error("Unauthorized");

        await ctx.db.insert("books", {
            ...args,
            copiesAvailable: args.copiesTotal,
            addedBy: user._id,
        });
    }
});

export const updateBook = mutation({
    args: {
        id: v.id("books"),
        copiesAvailable: v.optional(v.number()),
        // Add other fields as needed
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "librarian", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");

        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
    }
});

// --- Loan Management ---

export const checkoutBook = mutation({
    args: {
        bookId: v.id("books"),
        studentId: v.id("users"),
        dueDate: v.string(), // ISO date
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { hasRole, user } = await hasAnyRole(ctx, ["admin", "librarian", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");

        const book = await ctx.db.get(args.bookId);
        if (!book) throw new Error("Book not found");
        if (book.copiesAvailable < 1) throw new Error("No copies available");

        // Check if student already has this book borrowed and active
        const activeLoan = await ctx.db.query("loans")
            .withIndex("by_user", q => q.eq("userId", args.studentId))
            .filter(q => q.eq(q.field("bookId"), args.bookId))
            .filter(q => q.eq(q.field("status"), "active"))
            .unique();

        if (activeLoan) throw new Error("User already has this book checked out");

        // Create loan
        await ctx.db.insert("loans", {
            bookId: args.bookId,
            userId: args.studentId,
            borrowDate: new Date().toISOString(),
            dueDate: args.dueDate,
            status: "active",
            notes: args.notes
        });

        // Decrement copies
        await ctx.db.patch(args.bookId, {
            copiesAvailable: book.copiesAvailable - 1
        });
    }
});

export const returnBook = mutation({
    args: {
        loanId: v.id("loans"),
        condition: v.optional(v.string()), // "good", "damaged", etc - just note for now
    },
    handler: async (ctx, args) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "librarian", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");

        const loan = await ctx.db.get(args.loanId);
        if (!loan) throw new Error("Loan not found");
        if (loan.status !== "active") throw new Error("Loan is not active");

        // Mark returned
        await ctx.db.patch(args.loanId, {
            status: "returned",
            returnDate: new Date().toISOString(),
            notes: args.condition ? `${loan.notes || ''} [Return Condition: ${args.condition}]` : loan.notes
        });

        // Increment copies
        const book = await ctx.db.get(loan.bookId);
        if (book) {
            await ctx.db.patch(loan.bookId, {
                copiesAvailable: book.copiesAvailable + 1
            });
        }
    }
});

export const getActiveLoans = query({
    args: {},
    handler: async (ctx) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "librarian", "manager"]);
        if (!hasRole) throw new Error("Unauthorized");

        const loans = await ctx.db.query("loans")
            .withIndex("by_status", q => q.eq("status", "active"))
            .collect();

        // Enrich with book and user details
        const enriched = await Promise.all(loans.map(async (loan) => {
            const book = await ctx.db.get(loan.bookId);
            const user = await ctx.db.get(loan.userId);
            return {
                ...loan,
                bookTitle: book?.title || "Unknown Book",
                studentName: user?.name || "Unknown Student",
                studentRole: user?.role
            };
        }));

        return enriched;
    }
});

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const { hasRole } = await hasAnyRole(ctx, ["admin", "librarian", "manager"]);
        if (!hasRole) return null;

        const books = await ctx.db.query("books").collect();
        const activeLoans = await ctx.db.query("loans").withIndex("by_status", q => q.eq("status", "active")).collect();

        const totalBooks = books.length;
        const totalCopies = books.reduce((acc, b) => acc + b.copiesTotal, 0);
        const availableCopies = books.reduce((acc, b) => acc + b.copiesAvailable, 0);

        return {
            totalBooks,
            totalCopies,
            availableCopies,
            activeLoans: activeLoans.length,
            overdueLoans: activeLoans.filter(l => new Date(l.dueDate) < new Date()).length
        };
    }
});
