"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, ChevronLeft, Flag, Check, X, Sparkles, Trophy, ArrowLeft, RefreshCcw, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { useAudio } from "@/components/AudioProvider";

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
    const [combo, setCombo] = useState(0);
    const [showCombo, setShowCombo] = useState(false);
    const { playSFX } = useAudio();
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
        const isCorrect = optIdx === currentQuestion.correctOption;
        setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));

        if (isCorrect) {
            playSFX('success');
            setCombo(prev => prev + 1);
            if (combo + 1 >= 3) {
                setShowCombo(true);
                setTimeout(() => setShowCombo(false), 2000);
            }
        } else {
            playSFX('error');
            setCombo(0);
            // Haptic Feedback for incorrect selection
            if (typeof window !== "undefined" && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }
    };

    const handleFinish = async () => {
        setSubmitting(true);
        playSFX('finish');
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
                const duration = 5 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 40, spread: 360, ticks: 100, zIndex: 0 };

                const interval: any = setInterval(function () {
                    const timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) return clearInterval(interval);
                    const particleCount = 70 * (timeLeft / duration);
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
            playSFX('click');
            setDirection(1);
            setCurrentIdx(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentIdx > 0) {
            playSFX('click');
            setDirection(-1);
            setCurrentIdx(prev => prev - 1);
        }
    };

    if (isFinished) {
        return (
            <div className="max-w-5xl w-full mx-auto pb-24 px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-morphism rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border-primary/20"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full -z-10" />

                    <motion.div
                        initial={{ rotate: -20, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="inline-flex items-center justify-center p-8 bg-gradient-to-br from-primary via-secondary to-accent rounded-[3rem] shadow-2xl shadow-primary/40 mb-12"
                    >
                        <Trophy className="h-24 w-24 text-white" />
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight">Efsanevi Sonuç!</h2>
                    <p className="text-primary font-black text-2xl mb-16 uppercase tracking-[0.4em]">{subjectName}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            { label: "Doğru", val: stats.correct, color: "text-success", bg: "bg-success/5", border: "border-success/20" },
                            { label: "Yanlış", val: stats.wrong, color: "text-danger", bg: "bg-danger/5", border: "border-danger/20" },
                            { label: "Puan", val: `%${stats.score}`, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className={cn("p-12 rounded-[3rem] border transition-universal hover:scale-105 hover:bg-white/5", stat.bg, stat.border)}
                            >
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-foreground/30 mb-4">{stat.label}</p>
                                <p className={cn("text-6xl font-black", stat.color)}>{stat.val}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-foreground/5 rounded-[4rem] p-16 border border-border-theme/40 relative group overflow-hidden mb-16 shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                                <span className="font-black text-foreground/40 uppercase tracking-[0.4em] text-sm">Kozmik Tecrübe Kazancı</span>
                            </div>
                            <div className="flex items-baseline justify-center gap-4">
                                <span className="text-8xl font-black text-primary text-glow">+{stats.score * 10}</span>
                                <span className="text-4xl font-black text-secondary">XP</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <button
                            onClick={() => { playSFX('click'); router.push("/"); }}
                            className="flex-1 py-8 bg-foreground text-background dark:bg-white dark:text-black rounded-[2.5rem] font-black text-xl transition-universal hover:opacity-90 hover:scale-[1.05] shadow-2xl active:scale-95"
                        >
                            Merkez Üsse Dön
                        </button>
                        <button
                            onClick={() => { playSFX('click'); window.location.reload(); }}
                            className="w-full sm:w-32 flex items-center justify-center bg-foreground/5 py-8 rounded-[2.5rem] border border-border-theme/50 transition-universal hover:bg-foreground/10 active:scale-95"
                        >
                            <RefreshCcw className="h-10 w-10 text-foreground" />
                        </button>
                    </div>
                </motion.div>

                {/* Question Review Section */}
                <div className="mt-32 space-y-12">
                    <div className="flex items-center gap-6 px-4">
                        <div className="h-3 w-20 bg-primary rounded-full" />
                        <h3 className="text-4xl font-black uppercase tracking-[0.3em]">Derin Gözlem</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                        {questions.map((q, idx) => {
                            const userAnswer = answers[idx];
                            const isCorrect = userAnswer === q.correctOption;
                            return (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className={cn(
                                        "glass-morphism p-12 rounded-[4rem] border-l-[20px] group relative overflow-hidden transition-universal",
                                        isCorrect ? "border-l-success aura-primary" : "border-l-danger aura-accent"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-10 relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-8">
                                                <span className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl",
                                                    isCorrect ? "bg-success text-white" : "bg-danger text-white"
                                                )}>
                                                    {idx + 1}
                                                </span>
                                                <span className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40">
                                                    {isCorrect ? "Moleküler Uyum" : "Hatalı Bağlanma"}
                                                </span>
                                            </div>
                                            <p className="text-2xl md:text-3xl font-black text-foreground leading-[1.3] mb-12">{q.text}</p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className={cn("p-8 rounded-[2rem] border-2 flex flex-col gap-2", isCorrect ? "bg-success/5 border-success/20" : "bg-danger/5 border-danger/20")}>
                                                    <span className="text-[10px] uppercase font-black opacity-30 tracking-widest">Senin Seçimin</span>
                                                    <span className={cn("font-black text-xl", isCorrect ? "text-success" : "text-danger")}>
                                                        {userAnswer !== undefined ? q.options[userAnswer] : "Boş"}
                                                    </span>
                                                </div>
                                                {!isCorrect && (
                                                    <div className="p-8 bg-success/5 border-2 border-success/20 rounded-[2rem] flex flex-col gap-2">
                                                        <span className="text-[10px] uppercase font-black opacity-30 tracking-widest">Kararlı Yapı (Doğru)</span>
                                                        <span className="text-success font-black text-xl">{q.options[q.correctOption]}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 bg-foreground/5 p-12 rounded-full opacity-0 group-hover:opacity-100 transition-universal">
                                        {isCorrect ? <Check className="h-32 w-32 text-success/20" /> : <X className="h-32 w-32 text-danger/20" />}
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
        <div className="max-w-5xl w-full mx-auto px-6 md:px-12 relative">
            <AnimatePresence>
                {showCombo && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: -100 }}
                        exit={{ scale: 1.5, opacity: 0, y: -200 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                    >
                        <div className="bg-gradient-to-r from-primary via-secondary to-accent px-12 py-6 rounded-[3rem] shadow-[0_0_80px_rgba(var(--primary-rgb),0.6)] flex items-center gap-6 border-4 border-white/20">
                            <Zap className="h-12 w-12 text-white animate-pulse" />
                            <div className="text-white">
                                <p className="text-xl font-black uppercase tracking-[0.4em] leading-none">KOMBO!</p>
                                <p className="text-5xl font-black leading-none">{combo}x</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Universal Progress Section */}
            <div className="mb-20 glass-morphism p-8 rounded-[4rem] border-primary/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />

                <div className="flex justify-between items-center relative z-10 px-4 mb-8">
                    <button onClick={() => { playSFX('click'); router.back(); }} className="p-5 bg-foreground/5 rounded-3xl hover:bg-foreground/10 transition-universal border border-border-theme/30 shadow-lg">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-2">Simülasyon Seansı</p>
                        <h1 className="text-3xl font-black text-foreground">{subjectName}</h1>
                    </div>
                    <div className="bg-primary/10 px-6 py-3 rounded-3xl border border-primary/20 shadow-inner">
                        <span className="text-2xl font-black text-primary">{currentIdx + 1}</span>
                        <span className="text-foreground/20 font-black mx-2 text-xl">/</span>
                        <span className="text-foreground/40 font-black text-xl">{questions.length}</span>
                    </div>
                </div>

                <div className="relative h-10 bg-foreground/5 rounded-[2rem] overflow-hidden p-2 border border-border-theme/20 shadow-2xl">
                    <motion.div
                        className="absolute inset-y-2 left-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-[1.5rem] shadow-xl relative"
                        initial={{ width: 0 }}
                        animate={{ width: `calc(${progress}% - 16px)` }}
                        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="absolute top-0 right-0 h-full w-40 bg-gradient-to-l from-white/30 to-transparent overflow-hidden">
                            <motion.div
                                animate={{ x: [-200, 400], opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 -translate-y-1/2 h-[200%] w-12 bg-white/60 blur-xl rotate-45"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Question Container */}
            <div className="relative min-h-[600px] mb-32 lg:mb-0">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentIdx}
                        custom={direction}
                        variants={{
                            enter: (d) => ({ x: d > 0 ? 200 : -200, opacity: 0, scale: 0.9, rotate: d > 0 ? 5 : -5 }),
                            center: { x: 0, opacity: 1, scale: 1, rotate: 0 },
                            exit: (d) => ({ x: d > 0 ? -200 : 200, opacity: 0, scale: 0.9, rotate: d > 0 ? -5 : 5 })
                        }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="glass-morphism rounded-[5rem] p-12 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-primary/10 relative overflow-hidden"
                    >
                        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />

                        <div className="absolute top-12 left-12 w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-[2rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl rotate-3">
                            {currentIdx + 1}
                        </div>

                        <div className="mb-20 pt-12">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-5xl font-black text-foreground leading-[1.2] tracking-tight"
                            >
                                {currentQuestion.text}
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = answers[currentIdx] === idx;
                                return (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                        onClick={() => handleSelect(idx)}
                                        className={cn(
                                            "w-full text-left p-8 md:p-10 rounded-[3rem] border-4 transition-universal flex items-center group relative overflow-hidden",
                                            isSelected
                                                ? "border-primary bg-primary/20 shadow-2xl shadow-primary/20 scale-[1.02]"
                                                : "border-border-theme/40 hover:border-primary/40 hover:bg-white/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center font-black mr-6 md:mr-8 transition-universal shadow-2xl grow-0 shrink-0 text-2xl",
                                            isSelected
                                                ? "bg-primary text-white scale-110 rotate-6 shadow-primary/40"
                                                : "bg-foreground/5 text-foreground/40 group-hover:bg-primary/20 group-hover:text-primary group-hover:rotate-12"
                                        )}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={cn(
                                            "text-xl md:text-3xl font-black transition-colors flex-1",
                                            isSelected ? "text-foreground" : "text-foreground/60"
                                        )}>
                                            {option}
                                        </span>
                                        {isSelected && (
                                            <motion.div
                                                layoutId="active-particle"
                                                className="absolute right-10 h-6 w-6 rounded-full bg-primary aura-primary shadow-[0_0_20px_var(--primary)]"
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Universal Floating Navigation */}
            <div className="fixed bottom-10 left-0 right-0 px-8 z-50 lg:relative lg:bottom-auto lg:px-0 lg:mt-20 lg:mb-12">
                <div className="max-w-5xl mx-auto flex items-center gap-6">
                    <button
                        onClick={prevQuestion}
                        disabled={currentIdx === 0}
                        className="p-8 bg-glass-morphism backdrop-blur-3xl text-foreground/40 hover:bg-foreground/10 rounded-[2.5rem] disabled:opacity-0 transition-universal border border-border-theme/40 shadow-2xl active:scale-90"
                    >
                        <ChevronLeft className="h-10 w-10" />
                    </button>

                    {currentIdx === questions.length - 1 ? (
                        <button
                            onClick={handleFinish}
                            disabled={submitting || answers[currentIdx] === undefined}
                            className="flex-1 py-9 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-[3rem] font-black flex items-center justify-center gap-6 transition-universal hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-2xl shadow-primary/40 text-2xl"
                        >
                            {submitting ? <RefreshCcw className="h-8 w-8 animate-spin" /> : (
                                <>
                                    <Sparkles className="h-8 w-8" />
                                    SEANSI TAMAMLA
                                    <Flag className="h-8 w-8" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            disabled={answers[currentIdx] === undefined}
                            className="flex-1 py-9 bg-foreground text-background dark:bg-white dark:text-black rounded-[3rem] font-black flex items-center justify-center gap-6 transition-universal hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-2xl text-2xl"
                        >
                            İLERLEMEYE DEVAM ET
                            <ChevronRight className="h-8 w-8" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
