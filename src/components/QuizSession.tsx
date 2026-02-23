"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, ChevronLeft, Flag, Check, X, Sparkles, Trophy, ArrowLeft, RefreshCcw } from "lucide-react";
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
}

export default function QuizSession({ questions, subjectId, subjectName }: Props) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [direction, setDirection] = useState(0);
    const router = useRouter();

    const currentQuestion = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    const stats = useMemo(() => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctOption) correct++;
        });
        const total = questions.length;
        const score = Math.round((correct / total) * 100);
        return { correct, total, wrong: total - correct, score };
    }, [answers, questions]);

    const handleSelect = (optIdx: number) => {
        setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));

        // Haptic Feedback for incorrect selection (experimental API)
        if (optIdx !== currentQuestion.correctOption && typeof window !== "undefined" && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    };

    const handleFinish = async () => {
        setSubmitting(true);
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
                const duration = 3 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                const interval: any = setInterval(function () {
                    const timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) return clearInterval(interval);
                    const particleCount = 50 * (timeLeft / duration);
                    confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
                }, 250);
            }
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const nextQuestion = () => {
        if (currentIdx < questions.length - 1) {
            setDirection(1);
            setCurrentIdx(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentIdx > 0) {
            setDirection(-1);
            setCurrentIdx(prev => prev - 1);
        }
    };

    if (isFinished) {
        return (
            <div className="max-w-4xl w-full mx-auto pb-24 px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism rounded-[3rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl shadow-primary/10"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[120px] rounded-full -z-10" />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-2xl shadow-primary/40 mb-8"
                    >
                        <Trophy className="h-16 w-16 text-white" />
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">Mükemmel İş!</h2>
                    <p className="text-foreground/50 font-bold text-xl mb-12 uppercase tracking-widest">{subjectName}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: "Doğru", val: stats.correct, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
                            { label: "Yanlış", val: stats.wrong, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" },
                            { label: "Başarı", val: `%${stats.score}`, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className={cn("p-10 rounded-[2.5rem] border border-transparent transition-glass hover:scale-105", stat.bg, stat.border)}
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-3">{stat.label}</p>
                                <p className={cn("text-5xl font-black", stat.color)}>{stat.val}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-foreground/5 rounded-[2.5rem] p-10 border border-border-theme/40 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                                <span className="font-black text-foreground/40 uppercase tracking-widest text-xs">Toplam Kazanılan Tecrübe</span>
                            </div>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-6xl font-black text-primary text-glow">+{stats.score * 10}</span>
                                <span className="text-2xl font-black text-secondary">XP</span>
                            </div>
                            {result?.streak && (
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="mt-8 inline-flex items-center gap-3 bg-orange-500/10 text-orange-500 py-3 px-6 rounded-2xl border border-orange-500/20 shadow-lg shadow-orange-500/5 font-black uppercase text-sm tracking-wider"
                                >
                                    🔥 {result.streak} GÜNLÜK SERİ!
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => router.push("/")}
                            className="flex-1 py-6 bg-foreground text-background dark:bg-white dark:text-black rounded-[2rem] font-black text-lg transition-glass hover:opacity-90 hover:scale-[1.02] shadow-xl active:scale-95"
                        >
                            Ana Sayfaya Dön
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full sm:w-24 flex items-center justify-center bg-foreground/5 py-6 rounded-[2rem] border border-border-theme/50 transition-glass hover:bg-foreground/10 active:scale-95"
                        >
                            <RefreshCcw className="h-8 w-8 text-foreground" />
                        </button>
                    </div>
                </motion.div>

                {/* Question Review Section */}
                <div className="mt-20 space-y-8">
                    <div className="flex items-center gap-4 px-2">
                        <div className="h-2 w-12 bg-primary rounded-full" />
                        <h3 className="text-2xl font-black uppercase tracking-widest">Soru Gözlem</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {questions.map((q, idx) => {
                            const userAnswer = answers[idx];
                            const isCorrect = userAnswer === q.correctOption;
                            return (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className={cn(
                                        "glass p-8 rounded-[2.5rem] border-l-[12px] group relative overflow-hidden",
                                        isCorrect ? "border-l-success" : "border-l-danger"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-6 relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className={cn(
                                                    "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm",
                                                    isCorrect ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                                                )}>
                                                    {idx + 1}
                                                </span>
                                                <span className="text-xs font-black uppercase tracking-widest text-foreground/40">
                                                    {isCorrect ? "Kusursuz Cevap" : "Gözden Geçir"}
                                                </span>
                                            </div>
                                            <p className="text-xl font-bold text-foreground leading-relaxed mb-8">{q.text}</p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className={cn("p-5 rounded-2xl border flex flex-col gap-1", isCorrect ? "bg-success/5 border-success/10" : "bg-danger/5 border-danger/10")}>
                                                    <span className="text-[10px] uppercase font-black opacity-30">Senin Cevabın</span>
                                                    <span className={cn("font-bold text-lg", isCorrect ? "text-success" : "text-danger")}>
                                                        {userAnswer !== undefined ? q.options[userAnswer] : "Boş"}
                                                    </span>
                                                </div>
                                                {!isCorrect && (
                                                    <div className="p-5 bg-success/5 border border-success/10 rounded-2xl flex flex-col gap-1">
                                                        <span className="text-[10px] uppercase font-black opacity-30">Doğru Cevap</span>
                                                        <span className="text-success font-bold text-lg">{q.options[q.correctOption]}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            {isCorrect ? <Check className="h-10 w-10 text-success" /> : <X className="h-10 w-10 text-danger" />}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 bg-foreground/5 p-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isCorrect ? <Check className="h-24 w-24 text-success" /> : <X className="h-24 w-24 text-danger" />}
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
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6">
            {/* Liquid Progress Bar Section */}
            <div className="mb-12 glass p-4 rounded-[2.5rem] border border-border-theme/30 backdrop-blur-3xl shadow-xl">
                <div className="flex justify-between items-center px-4 mb-4">
                    <button onClick={() => router.back()} className="p-3 bg-foreground/5 rounded-2xl hover:bg-foreground/10 transition-colors border border-border-theme/30">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Meydan Okuma</p>
                        <h1 className="text-2xl font-black text-foreground truncate max-w-[150px] md:max-w-md">{subjectName}</h1>
                    </div>
                    <div className="bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
                        <span className="text-lg font-black text-primary">{currentIdx + 1}</span>
                        <span className="text-foreground/20 font-black mx-1">/</span>
                        <span className="text-foreground/40 font-bold">{questions.length}</span>
                    </div>
                </div>

                <div className="relative h-6 bg-foreground/5 rounded-2xl overflow-hidden p-1 border border-border-theme/20 shadow-inner">
                    <motion.div
                        className="absolute inset-y-1 left-1 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg shadow-primary/30 relative"
                        initial={{ width: 0 }}
                        animate={{ width: `calc(${progress}% - 8px)` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-white/20 to-transparent overflow-hidden">
                            <motion.div
                                animate={{ x: [0, 100], opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 -translate-y-1/2 h-full w-4 bg-white/40 blur-md rotate-12"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Question Container */}
            <div className="relative min-h-[500px] mb-24 lg:mb-0">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentIdx}
                        custom={direction}
                        variants={{
                            enter: (d) => ({ x: d > 0 ? 100 : -100, opacity: 0, scale: 0.95, transition: { duration: 0.4 } }),
                            center: { x: 0, opacity: 1, scale: 1 },
                            exit: (d) => ({ x: d > 0 ? -100 : 100, opacity: 0, scale: 0.95, transition: { duration: 0.4 } })
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="glass rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-primary/10 border-border-theme/40 relative"
                    >
                        <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/30">
                            {currentIdx + 1}
                        </div>

                        <div className="mb-12">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl md:text-4xl font-black text-foreground leading-[1.3] text-mask"
                            >
                                {currentQuestion.text}
                            </motion.p>
                        </div>

                        <div className="space-y-4 mb-10">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = answers[currentIdx] === idx;
                                return (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + idx * 0.1 }}
                                        onClick={() => handleSelect(idx)}
                                        className={cn(
                                            "w-full text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-300 flex items-center group relative overflow-hidden",
                                            isSelected
                                                ? "border-primary bg-primary/10 shadow-xl shadow-primary/10"
                                                : "border-border-theme/40 hover:border-primary/40 hover:bg-foreground/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-black mr-4 md:mr-6 transition-all duration-300 shadow-md shrink-0",
                                            isSelected
                                                ? "bg-primary text-white scale-110 rotate-3"
                                                : "bg-foreground/5 text-foreground/40 group-hover:bg-primary/20 group-hover:text-primary group-hover:rotate-6"
                                        )}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={cn(
                                            "text-lg md:text-2xl font-bold transition-colors truncate",
                                            isSelected ? "text-foreground" : "text-foreground/70"
                                        )}>
                                            {option}
                                        </span>
                                        {isSelected && (
                                            <motion.div
                                                layoutId="active-indicator"
                                                className="absolute right-8 h-4 w-4 rounded-full bg-primary glow shadow-primary/50 hidden md:block"
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Desktop Navigation Floating (Fixed below question on small mobile) */}
            <div className="fixed bottom-6 left-0 right-0 px-6 sm:px-12 z-40 lg:relative lg:bottom-auto lg:px-0 lg:mt-12 lg:mb-12">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={prevQuestion}
                        disabled={currentIdx === 0}
                        className="p-6 bg-glass text-foreground/40 hover:bg-foreground/10 rounded-3xl disabled:opacity-0 transition-glass border border-border-theme/50 shadow-2xl active:scale-90"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>

                    {currentIdx === questions.length - 1 ? (
                        <button
                            onClick={handleFinish}
                            disabled={submitting || answers[currentIdx] === undefined}
                            className="flex-1 py-7 bg-gradient-to-r from-primary to-secondary text-white rounded-[2rem] font-black flex items-center justify-center gap-4 transition-glass hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-2xl shadow-primary/40 text-xl"
                        >
                            {submitting ? <RefreshCcw className="h-7 w-7 animate-spin" /> : (
                                <>
                                    <Flag className="h-7 w-7" />
                                    Analizi Bitir
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            disabled={answers[currentIdx] === undefined}
                            className="flex-1 py-7 bg-foreground text-background dark:bg-white dark:text-black rounded-[2rem] font-black flex items-center justify-center gap-4 transition-glass hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-2xl text-xl"
                        >
                            Sıradaki Adım
                            <ChevronRight className="h-7 w-7" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
