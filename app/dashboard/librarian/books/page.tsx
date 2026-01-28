"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    BookOpen,
    Filter,
    MoreHorizontal,
    Edit,
    Trash,
    X,
    Upload,
    Barcode
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// Mock Books Data
const initialBooks = [
    { id: 1, title: "Sahih Al-Bukhari Vol 1", author: "Imam Bukhari", isbn: "978-1234567890", category: "Hadith", copies: 12, available: 8, cover: "bg-emerald-900" },
    { id: 2, title: "The Sealed Nectar", author: "Safiur Rahman", isbn: "978-0987654321", category: "Seerah", copies: 20, available: 15, cover: "bg-amber-900" },
    { id: 3, title: "Tajweed Rules", author: "Kareema Carol", isbn: "978-5555555555", category: "Quranic", copies: 30, available: 28, cover: "bg-blue-900" },
    { id: 4, title: "Fiqh Us-Sunnah", author: "Sayyid Sabiq", isbn: "978-1111111111", category: "Fiqh", copies: 8, available: 0, cover: "bg-slate-800" },
    { id: 5, title: "Stories of the Prophets", author: "Ibn Kathir", isbn: "978-2222222222", category: "History", copies: 15, available: 10, cover: "bg-purple-900" },
    { id: 6, title: "Fortress of the Muslim", author: "Said Bin Ali", isbn: "978-3333333333", category: "Dua", copies: 50, available: 45, cover: "bg-rose-900" },
];

export default function BooksPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isAddBookOpen, setIsAddBookOpen] = useState(false);

    const filteredBooks = initialBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-8 font-sans text-slate-100 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] right-[30%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-indigo-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Book Inventory</h1>
                        <p className="text-slate-400 mt-1">Manage library catalog, update stock, and organize collections.</p>
                    </div>
                    <button
                        onClick={() => setIsAddBookOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add New Book
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-xl">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
                        {['All', 'Quranic', 'Hadith', 'Seerah', 'Fiqh', 'History', 'Dua'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by title, author, ISBN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredBooks.map((book) => (
                            <motion.div
                                key={book.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-900/10 cursor-pointer"
                            >
                                {/* Cover Area */}
                                <div className={`h-48 w-full ${book.cover} relative flex items-center justify-center p-6 bg-opacity-80 group-hover:bg-opacity-100 transition-all`}>
                                    <BookOpen className="w-16 h-16 text-white/20 group-hover:text-white/40 transition-colors" />
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 bg-slate-900/50 hover:bg-slate-900 rounded-full text-white backdrop-blur-md">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-950/90 to-transparent">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs uppercase font-bold tracking-wider text-slate-300 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">{book.category}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Area */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-slate-100 mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">{book.title}</h3>
                                    <p className="text-sm text-slate-400 mb-4">{book.author}</p>

                                    <div className="flex justify-between items-center text-xs font-medium pt-4 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-slate-500">In Stock</span>
                                            <span className={`text-sm ${book.available > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {book.available} <span className="text-slate-600">/ {book.copies}</span>
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-blue-400 transition-colors tooltip" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add Book Modal */}
            <Dialog.Root open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-white/10 rounded-2xl p-6 w-[90%] max-w-lg z-50 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <Dialog.Title className="text-xl font-bold text-white">Add New Book</Dialog.Title>
                            <Dialog.Close className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </Dialog.Close>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Book Title</label>
                                <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50" placeholder="e.g. Riyadus Saliheen" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Author</label>
                                    <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50" placeholder="Author Name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">ISBN</label>
                                    <div className="relative">
                                        <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50" placeholder="978-..." />
                                        <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                                    <select className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50">
                                        <option>Quranic</option>
                                        <option>Hadith</option>
                                        <option>Seerah</option>
                                        <option>Fiqh</option>
                                        <option>History</option>
                                        <option>Dua</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Total Copies</label>
                                    <input type="number" className="w-full bg-slate-800 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50" defaultValue={1} />
                                </div>
                            </div>

                            <div className="border border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-800/50 hover:border-white/20 transition-all cursor-pointer">
                                <Upload className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-xs">Upload Cover Image</span>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => setIsAddBookOpen(false)}
                                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-600/20">
                                    Add to Catalog
                                </button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    );
}
