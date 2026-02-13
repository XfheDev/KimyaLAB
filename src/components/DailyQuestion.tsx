"use client";

import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

    if (loading) return <div className="h-48 bg-foreground/5 animate-pulse rounded-2xl"></div>;
    if (!question || question.message) return null;

    const handleSelect = async (idx: number) => {
        if (showResult) return;
        setSelected(idx);
        setShowResult(true);

        if (idx === question.correctOption) {
            // Award functional XP: 50 XP for daily question
            try {
                await fetch("/api/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        subjectId: question.subjectId,
                        score: 100, // 100% correct
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
        <div className="glass rounded-[2.5rem] p-8 md:p-10 border-none shadow-2xl shadow-primary/10 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="h-40 w-40 text-primary" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 bg-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">Günün Sorusu</span>
                        <span className="text-foreground/40 text-[10px] font-black uppercase tracking-widest leading-none">• {question.subjectName}</span>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-8 leading-snug">
                    {question.text}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option: string, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={showResult}
                            className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 font-bold flex items-center justify-between group/opt ${showResult
                                ? idx === question.correctOption
                                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                                    : selected === idx
                                        ? "bg-red-500/20 border-red-500 text-red-500"
                                        : "bg-foreground/5 border-transparent opacity-40"
                                : "bg-foreground/5 border-transparent hover:border-primary/30 hover:bg-foreground/10"
                                }`}
                        >
                            <span className="text-lg">{option}</span>
                            {showResult && idx === question.correctOption && (
                                <Sparkles className="h-5 w-5 animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>

                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-foreground/5 rounded-3xl border border-border-theme/50"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${selected === question.correctOption ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                                {selected === question.correctOption ? "✓" : "×"}
                            </div>
                            <p className="font-black text-foreground">
                                {selected === question.correctOption
                                    ? "🌟 Tebrikler! 100 XP kazandın."
                                    : "Üzgünüm, doğru cevap şuydu: " + question.options[question.correctOption]}
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = '#topics'}
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30"
                        >
                            Diğer Konuları Keşfet
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
