"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Loader2, BookOpen, Star, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function LibraryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // We can filter by category in query if we want, but for simplicity let's filter client side or pass arg
    const books = useQuery(api.library.listBooks, {
        search: searchTerm,
        category: activeCategory || undefined
    });

    const categories = ["Islamic Studies", "Quran", "Hadith", "History", "Arabic Language", "General"];

    return (
        <div className="min-h-screen bg-background p-6 lg:p-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-16 w-16 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-4"
                >
                    <BookOpen className="h-8 w-8 text-amber-500" />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl lg:text-5xl font-bold font-amiri tracking-tight"
                >
                    Knowledge Repository
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground max-w-xl text-lg"
                >
                    Explore our curated collection of Islamic texts, history books, and educational resources.
                </motion.p>
            </div>

            {/* Search & Filter */}
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="relative">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search by title, author, or ISBN..."
                        className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-lg shadow-xl focus:ring-amber-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    <Button
                        variant={activeCategory === null ? "default" : "outline"}
                        onClick={() => setActiveCategory(null)}
                        className={`rounded-full ${activeCategory === null ? "bg-amber-500 hover:bg-amber-600 text-black" : "border-white/10"}`}
                    >
                        All Books
                    </Button>
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? "default" : "outline"}
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-full ${activeCategory === cat ? "bg-amber-500 hover:bg-amber-600 text-black" : "border-white/10"}`}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Books Grid */}
            <div className="max-w-7xl mx-auto">
                {books === undefined ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                        <p className="text-muted-foreground animate-pulse">Browsing shelves...</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No books found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {books.map((book, idx) => (
                            <motion.div
                                key={book._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative aspect-[3/4] rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 overflow-hidden transition-all hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
                            >
                                {/* Cover Placeholder (if no URL) */}
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="h-16 w-12 border-2 border-white/10 rounded mb-4" />
                                    <h3 className="font-bold font-amiri text-lg line-clamp-2 leading-tight mb-1 group-hover:text-amber-400 transition-colors">{book.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                                </div>

                                {/* Overlay Details */}
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                    <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{book.category}</Badge>
                                        <p className="text-sm text-zinc-300 line-clamp-3">{book.description || "No description available."}</p>
                                        <div className="pt-2 flex items-center justify-between text-xs font-medium">
                                            <span className={book.copiesAvailable > 0 ? "text-emerald-400" : "text-red-400"}>
                                                {book.copiesAvailable > 0 ? "Available" : "Checked Out"}
                                            </span>
                                            <span className="text-zinc-500">Location: {book.location || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Dot */}
                                <div className={`absolute top-3 right-3 h-2 w-2 rounded-full ${book.copiesAvailable > 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500"}`} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
