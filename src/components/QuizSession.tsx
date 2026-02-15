"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, ChevronLeft, Flag, Check, X, Sparkles, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface Question {
    id: string;
    text: string;
    options: string[];
    correctOption: number;
}

interface Props {
    questions: Question[];
    subjectId: string;
    subjectName: string;
    initialSavedIds?: string[];
}

export default function QuizSession({ questions, subjectId, subjectName, initialSavedIds = [] }: Props) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds);
    const router = useRouter();

    const currentQuestion = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    const handleSelect = (optIdx: number) => {
        setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctOption) correct++;
        });
        return {
            correct,
            total: questions.length,
            wrong: questions.length - correct,
            score: Math.round((correct / questions.length) * 100),
        };
    };

    const handleFinish = async () => {
        setSubmitting(true);
        const stats = calculateScore();

        try {
            const res = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subjectId,
                    ...stats,
                }),
            });
            const data = await res.json();
            setResult(data);
            setIsFinished(true);

            if (stats.score >= 80) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#00ff00', '#0000ff', '#ff0000', '#ffff00']
                });
            }
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleSave = async (questionId: string) => {
        // Optimistic update
        const isSaved = savedIds.includes(questionId);
        setSavedIds(prev => isSaved ? prev.filter(id => id !== questionId) : [...prev, questionId]);

        try {
            await fetch("/api/questions/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questionId }),
            });
        } catch (error) {
            console.error("Save failed:", error);
            // Revert on error
            setSavedIds(prev => isSaved ? [...prev, questionId] : prev.filter(id => id !== questionId));
        }
    };

    if (isFinished) {
        const stats = calculateScore();
        return (
            <div className="max-w-3xl w-full flex flex-col gap-8 animate-in fade-in zoom-in duration-500 pb-20">
                <div className="glass rounded-[2.5rem] p-10 text-center border-none shadow-2xl shadow-primary/10">
                    <div className="flex justify-center mb-8">
                        <div className="p-6 bg-emerald-500/20 rounded-full shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black text-foreground mb-2">Test Tamamlandı!</h2>
                    <p className="text-foreground/60 font-medium text-lg mb-10">{subjectName}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-8 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                            <p className="text-xs text-emerald-500 font-black uppercase tracking-widest mb-2">Doğru</p>
                            <p className="text-4xl font-black text-emerald-500">{stats.correct}</p>
                        </div>
                        <div className="p-8 bg-red-500/10 rounded-3xl border border-red-500/20">
                            <p className="text-xs text-red-500 font-black uppercase tracking-widest mb-2">Yanlış</p>
                            <p className="text-4xl font-black text-red-500">{stats.wrong}</p>
                        </div>
                        <div className="p-8 bg-primary/10 rounded-3xl border border-primary/20">
                            <p className="text-xs text-primary font-black uppercase tracking-widest mb-2">Puan</p>
                            <p className="text-4xl font-black text-primary">{stats.score}</p>
                        </div>
                    </div>

                    <div className="mt-12 bg-foreground/5 rounded-3xl p-6 border border-border-theme/50 relative overflow-hidden">
                        <motion.div
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: -50, opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <span className="text-4xl font-black text-primary/20">+{stats.score * 10} XP</span>
                        </motion.div>

                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            <p className="text-sm font-bold text-foreground/40">Kazandığın Tecrübe</p>
                        </div>
                        <p className="text-3xl font-black text-primary text-glow">+{stats.score * 10} XP</p>
                        {result?.streak && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mt-3 flex items-center justify-center gap-1.5 text-orange-500 bg-orange-500/5 py-2 px-4 rounded-2xl w-fit mx-auto border border-orange-500/10"
                            >
                                <span className="text-xl">🔥</span>
                                <span className="font-black text-sm uppercase tracking-wider">{result.streak} GÜNLÜK SERİ!</span>
                            </motion.div>
                        )}
                    </div>

                    <button
                        onClick={() => router.push("/")}
                        className="mt-10 w-full py-5 bg-primary text-white rounded-[1.5rem] font-black hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30 text-lg"
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <div className="h-1 w-8 bg-primary rounded-full" />
                        <h3 className="text-xl font-black uppercase tracking-widest text-foreground">Soru İncelemesi</h3>
                    </div>

                    <div className="space-y-4">
                        {questions.map((q, idx) => {
                            const userAnswer = answers[idx];
                            const isCorrect = userAnswer === q.correctOption;
                            return (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={cn(
                                        "glass p-8 rounded-[2rem] border-l-8 transition-all overflow-hidden relative",
                                        isCorrect ? "border-l-emerald-500" : "border-l-red-500"
                                    )}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        {isCorrect ? (
                                            <Check className="h-24 w-24 text-emerald-500" />
                                        ) : (
                                            <X className="h-24 w-24 text-red-500" />
                                        )}
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs",
                                                isCorrect ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                                            )}>
                                                {idx + 1}
                                            </span>
                                            <p className="text-sm font-black text-foreground/40 uppercase tracking-widest">
                                                {isCorrect ? "Doğru Cevaplandı" : "Hatalı Seçim"}
                                            </p>
                                        </div>

                                        <h4 className="text-xl font-bold text-foreground mb-6 leading-relaxed">
                                            {q.text}
                                        </h4>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className={cn(
                                                "p-4 rounded-2xl border flex flex-col gap-1",
                                                isCorrect ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"
                                            )}>
                                                <p className="text-[10px] font-black uppercase text-foreground/30">Senin Cevabın</p>
                                                <p className={cn("font-bold text-lg", isCorrect ? "text-emerald-500" : "text-red-500")}>
                                                    {userAnswer !== undefined ? q.options[userAnswer] : "Boş Bırakıldı"}
                                                </p>
                                            </div>

                                            {!isCorrect && (
                                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col gap-1">
                                                    <p className="text-[10px] font-black uppercase text-foreground/30">Doğru Cevap</p>
                                                    <p className="text-emerald-500 font-bold text-lg">
                                                        {q.options[q.correctOption]}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl w-full">
            <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">Kimya Testi</p>
                        <h1 className="text-2xl font-black text-foreground">{subjectName}</h1>
                    </div>
                    <span className="text-lg font-black text-primary">
                        {currentIdx + 1} <span className="text-foreground/20">/</span> {questions.length}
                    </span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-3 p-[2px]">
                    <div
                        className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-snug flex-1">
                        {currentQuestion.text}
                    </h3>
                    <button
                        onClick={() => toggleSave(currentQuestion.id)}
                        className="p-3 bg-foreground/5 hover:bg-primary/10 rounded-xl transition-all group"
                        title={savedIds.includes(currentQuestion.id) ? "Kaydedilenlerden çıkar" : "Soruyu kaydet"}
                    >
                        <Bookmark
                            className={`h-6 w-6 transition-colors ${savedIds.includes(currentQuestion.id)
                                    ? "text-primary fill-primary"
                                    : "text-foreground/40 group-hover:text-primary"
                                }`}
                        />
                    </button>
                </div>

                <div className="mt-12 space-y-4">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            className={`w-full text-left p-6 rounded-[1.5rem] border-2 transition-all duration-300 flex items-center group relative overflow-hidden ${answers[currentIdx] === idx
                                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                                : "border-border-theme hover:border-primary/30 hover:bg-foreground/5"
                                }`}
                        >
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black mr-5 transition-colors ${answers[currentIdx] === idx
                                    ? "bg-primary text-white"
                                    : "bg-foreground/10 text-foreground/40 group-hover:bg-primary/20 group-hover:text-primary"
                                    }`}
                            >
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span
                                className={`text-xl font-medium transition-colors ${answers[currentIdx] === idx ? "text-foreground" : "text-foreground/80"
                                    }`}
                            >
                                {option}
                            </span>

                            {answers[currentIdx] === idx && (
                                <div className="absolute right-6 h-3 w-3 rounded-full bg-primary animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-12 flex justify-between items-center gap-6">
                    <button
                        onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                        disabled={currentIdx === 0}
                        className="p-5 text-foreground/40 hover:bg-foreground/5 rounded-2xl disabled:opacity-0 transition-all border border-border-theme/50"
                    >
                        <ChevronLeft className="h-7 w-7" />
                    </button>

                    {currentIdx === questions.length - 1 ? (
                        <button
                            onClick={handleFinish}
                            disabled={submitting || answers[currentIdx] === undefined}
                            className="flex-1 py-5 bg-primary text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-2xl shadow-primary/30 text-lg"
                        >
                            <Flag className="h-6 w-6" />
                            Testi Bitir
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                            disabled={answers[currentIdx] === undefined}
                            className="flex-1 py-5 bg-primary text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-2xl shadow-primary/30 text-lg"
                        >
                            Sonraki Soru
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
