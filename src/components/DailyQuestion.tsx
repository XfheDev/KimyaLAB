"use client";

import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Zap, Target, BookOpen, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function DailyQuestion() {
    const [question, setQuestion] = useState<any>(null);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/daily")
            .then(res => res.json())
            .then(data => {
                setQuestion(data);
                setLoading(false);
            })
            .catch(() => {
                setQuestion(null);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="h-[400px] glass-morphism animate-pulse rounded-[3rem] flex items-center justify-center">
            <Zap className="h-12 w-12 text-primary opacity-20 animate-bounce" />
        </div>
    );

    if (!question || question.message) return null;

    const handleSelect = async (idx: number) => {
        if (showResult) return;
        setSelected(idx);
        setShowResult(true);

        if (idx === question.correctOption) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.8 },
                colors: ['#4f46e5', '#9333ea', '#10b981']
            });

            try {
                await fetch("/api/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        subjectId: question.subjectId,
                        score: 100,
                        correct: 1,
                        wrong: 0,
                    }),
                });
            } catch (err) {
                console.error("Daily XP award failed:", err);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 border-none shadow-2xl shadow-primary/10 relative overflow-hidden group"
        >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <Sparkles className="h-64 w-64 text-primary" />
            </div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="p-2.5 md:p-3 bg-primary/20 rounded-xl md:rounded-2xl border border-primary/20">
                            <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary fill-primary animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary">Günün Modülü</span>
                            <span className="text-xs md:text-sm font-black text-foreground/40 truncate max-w-[150px] md:max-w-none">{question.subjectName}</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl md:text-4xl font-black text-foreground mb-10 md:mb-12 leading-tight max-w-2xl">
                    {question.text}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {question.options.map((option: string, idx: number) => {
                        const isCorrect = idx === question.correctOption;
                        const isSelected = selected === idx;

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx)}
                                disabled={showResult}
                                className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-left transition-all duration-300 border-2 font-bold flex items-center justify-between group/opt relative overflow-hidden ${showResult
                                    ? isCorrect
                                        ? "bg-success/20 border-success text-success shadow-lg shadow-success/10"
                                        : isSelected
                                            ? "bg-danger/20 border-danger text-danger shadow-lg shadow-danger/10"
                                            : "bg-foreground/5 border-transparent opacity-40"
                                    : "bg-foreground/5 border-transparent hover:border-primary/40 hover:bg-foreground/10 hover:shadow-xl hover:-translate-y-1"
                                    }`}
                            >
                                <span className="text-lg md:text-2xl relative z-10">{option}</span>
                                {showResult && isCorrect && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="relative z-10"
                                    >
                                        <CheckCircle2 className="h-8 w-8 text-success" />
                                    </motion.div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {showResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-10 md:mt-12 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 p-6 md:p-8 bg-foreground/5 rounded-[2rem] md:rounded-[2.5rem] border border-border-theme/40 backdrop-blur-3xl"
                        >
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 shadow-2xl ${selected === question.correctOption
                                    ? "bg-success text-white shadow-success/40"
                                    : "bg-danger text-white shadow-danger/40"
                                    }`}>
                                    {selected === question.correctOption ? (
                                        <Trophy className="h-6 w-6 md:h-8 md:w-8" />
                                    ) : (
                                        <X className="h-6 w-6 md:h-8 md:w-8" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xl md:text-2xl font-black text-foreground mb-1">
                                        {selected === question.correctOption
                                            ? "Teknik Deha!"
                                            : "Hatalı Bağ!"}
                                    </p>
                                    <p className="text-xs md:text-base text-foreground/50 font-bold">
                                        {selected === question.correctOption
                                            ? "XP kazandın!"
                                            : "Doğru cevap şuydu: " + question.options[question.correctOption]}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:gap-4 w-full lg:w-auto">
                                <div className="px-5 md:px-6 py-3 md:py-4 bg-primary/10 rounded-xl md:rounded-2xl border border-primary/20 flex-1 lg:flex-none text-center">
                                    <span className="text-[9px] md:text-[10px] font-black uppercase text-primary block mb-0.5 md:mb-1">Ödül</span>
                                    <span className="text-lg md:text-xl font-black text-primary">+50 XP</span>
                                </div>
                                <button
                                    onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="p-4 md:p-6 bg-foreground text-background dark:bg-white dark:text-black rounded-xl md:rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl flex-1 lg:flex-none flex items-center justify-center"
                                >
                                    <ArrowRight className="h-6 w-6" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// Minimal missing component for the copy
function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
        </svg>
    );
}

function X(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
