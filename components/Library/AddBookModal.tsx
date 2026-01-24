"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, BookOpen, Plus, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddBookModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const addBook = useMutation(api.library.addBook);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setIsbn] = useState("");
    const [category, setCategory] = useState("Islamic Studies");
    const [copies, setCopies] = useState(1);
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await addBook({
                title,
                author,
                isbn,
                category,
                copiesTotal: Number(copies),
                location,
                description
            });
            toast.success("Book added to catalog successfully!");
            // Reset form
            setTitle("");
            setAuthor("");
            setIsbn("");
            setCopies(1);
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to add book");
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
                    className="relative w-full max-w-2xl overflow-hidden bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl p-0 flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Add New Book</h3>
                                <p className="text-xs text-zinc-400">Expand the library collection</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="add-book-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Book Title</Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Sahih Al-Bukhari"
                                        className="bg-black/40 border-white/10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Author</Label>
                                    <Input
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="e.g. Imam Bukhari"
                                        className="bg-black/40 border-white/10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Category</Label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full h-10 px-3 rounded-md border border-white/10 bg-black/40 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    >
                                        <option value="Islamic Studies">Islamic Studies</option>
                                        <option value="Quran">Quran</option>
                                        <option value="Hadith">Hadith</option>
                                        <option value="Fiqh">Fiqh</option>
                                        <option value="History">History</option>
                                        <option value="Arabic Language">Arabic Language</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">ISBN (Optional)</Label>
                                    <Input
                                        value={isbn}
                                        onChange={(e) => setIsbn(e.target.value)}
                                        placeholder="978-..."
                                        className="bg-black/40 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Total Copies</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={copies}
                                        onChange={(e) => setCopies(Number(e.target.value))}
                                        className="bg-black/40 border-white/10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Shelf Location</Label>
                                    <Input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Aisle 3, Shelf B"
                                        className="bg-black/40 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-zinc-400">Description</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief summary of the book..."
                                    className="bg-black/40 border-white/10 min-h-[100px]"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/10 bg-black/20">
                        <Button
                            type="submit"
                            form="add-book-form"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                <Plus className="h-5 w-5 mr-2" />
                            )}
                            Add Book to Library
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
