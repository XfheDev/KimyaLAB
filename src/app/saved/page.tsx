"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Loader2, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SavedQuestion {
    id: string; // Question ID
    text: string;
    options: string[];
    correctOption: number;
    subject: {
        name: string;
    };
    savedId: string; // SavedQuestion ID
    savedAt: string;
}

export default function SavedQuestionsPage() {
    const [questions, setQuestions] = useState<SavedQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch("/api/user/saved");
            if (res.ok) {
                const data = await res.json();
                setQuestions(data);
            }
        } catch (error) {
            console.error("Failed to fetch saved questions", error);
        } finally {
            setLoading(false);
        }
    };

    const removeSaved = async (questionId: string) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        try {
            await fetch("/api/questions/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questionId }),
            });
        } catch (error) {
            console.error("Failed to remove question", error);
            fetchQuestions(); // Revert on error
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 pb-20">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 flex items-center gap-4">
                    <Link href="/" className="p-3 bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-colors">
                        <ArrowLeft className="h-6 w-6 text-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-foreground">Kaydedilenler</h1>
                        <p className="text-foreground/60 font-medium">Favoriye eklediğin sorular ({questions.length})</p>
                    </div>
                </header>

                {questions.length === 0 ? (
                    <div className="text-center py-20 bg-foreground/5 rounded-[2.5rem]">
                        <Bookmark className="h-16 w-16 text-foreground/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">Henüz soru kaydetmedin</h3>
                        <p className="text-foreground/60 max-w-sm mx-auto">
                            Test çözerken beğendiğin veya tekrar etmek istediğin soruları kaydedebilirsin.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <AnimatePresence mode="popLayout">
                            {questions.map((q) => (
                                <motion.div
                                    key={q.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass p-6 md:p-8 rounded-[2rem] relative group"
                                >
                                    <div className="absolute top-6 right-6">
                                        <button
                                            onClick={() => removeSaved(q.id)}
                                            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                                            title="Kaydedilenlerden çıkar"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="pr-16">
                                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-lg mb-4">
                                            {q.subject.name}
                                        </span>
                                        <h3 className="text-xl font-bold text-foreground mb-6 leading-relaxed">
                                            {q.text}
                                        </h3>

                                        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase text-foreground/30 mb-1">Doğru Cevap</p>
                                            <p className="text-emerald-500 font-bold text-lg">
                                                {q.options[q.correctOption]}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
