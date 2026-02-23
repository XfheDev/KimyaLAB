"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, ChevronLeft, Flag, Check, X, Sparkles, Trophy, ArrowLeft, RefreshCcw, Zap, AlertTriangle } from "lucide-react";
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
    const [startTime] = useState(new Date().toISOString());
    const [focusWarning, setFocusWarning] = useState(false);

    const { playSFX } = useAudio();
    const router = useRouter();

    const currentQuestion = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    // Focus Guard: Detect tab switching
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !isFinished) {
                setFocusWarning(true);
                playSFX('error');
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isFinished, playSFX]);

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
                    answers, // Send raw answers for server-side verification
                    startTime, // Send start time for speed check
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Submission failed");
            }

            const data = await res.json();
            setResult(data);
            setIsFinished(true);

            if (data.score >= 80) {
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
        } catch (error: any) {
            console.error("Submission failed:", error);
            alert(`Hata: ${error.message}`);
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
        // ... (Existing result UI stays same, but uses 'result.score' instead of 'stats.score' for absolute truth)
        return (
            <div className="max-w-5xl w-full mx-auto pb-24 px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-morphism rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl border-primary/20"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 blur-[100px] md:blur-[150px] rounded-full -z-10" />

                    <motion.div
                        initial={{ rotate: -20, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="inline-flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-primary via-secondary to-accent rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-primary/40 mb-8 md:mb-12"
                    >
                        <Trophy className="h-16 w-16 md:h-24 md:w-24 text-white" />
                    </motion.div>

                    <h2 className="text-4xl md:text-7xl font-black text-foreground mb-4 md:mb-6 tracking-tight">Efsanevi Sonuç!</h2>
                    <p className="text-primary font-black text-xl md:text-2xl mb-10 md:mb-16 uppercase tracking-[0.4em]">{subjectName}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-16">
                        {[
                            { label: "Doğru", val: result?.attempt?.correct || stats.correct, color: "text-success", bg: "bg-success/5", border: "border-success/20" },
                            { label: "Yanlış", val: result?.attempt?.wrong || stats.wrong, color: "text-danger", bg: "bg-danger/5", border: "border-danger/20" },
                            { label: "Puan", val: `%${result?.score || stats.score}`, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className={cn("p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border transition-universal hover:scale-105 hover:bg-white/5", stat.bg, stat.border)}
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-2 md:mb-4">{stat.label}</p>
                                <p className={cn("text-4xl md:text-6xl font-black", stat.color)}>{stat.val}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-foreground/5 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 border border-border-theme/40 relative group overflow-hidden mb-12 md:mb-16 shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
                                <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary animate-pulse" />
                                <span className="font-black text-foreground/40 uppercase tracking-[0.4em] text-[10px] md:text-sm">Kozmik Tecrübe Kazancı</span>
                            </div>
                            <div className="flex items-baseline justify-center gap-3 md:gap-4">
                                <span className="text-6xl md:text-8xl font-black text-primary text-glow">+{result?.pointsEarned || 0}</span>
                                <span className="text-2xl md:text-4xl font-black text-secondary">XP</span>
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

                {/* Question Review Section (Same as before) */}
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
                                    <div className="flex items-start justify-between gap-6 md:gap-10 relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-6 md:mb-8">
                                                <span className={cn(
                                                    "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-lg md:text-xl shadow-xl",
                                                    isCorrect ? "bg-success text-white" : "bg-danger text-white"
                                                )}>
                                                    {idx + 1}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                                                    {isCorrect ? "Moleküler Uyum" : "Hatalı Bağlanma"}
                                                </span>
                                            </div>
                                            <p className="text-xl md:text-3xl font-black text-foreground leading-[1.3] mb-8 md:mb-12">{q.text}</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className={cn("p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 flex flex-col gap-1 md:gap-2", isCorrect ? "bg-success/5 border-success/20" : "bg-danger/5 border-danger/20")}>
                                                    <span className="text-[9px] md:text-[10px] uppercase font-black opacity-30 tracking-widest">Senin Seçimin</span>
                                                    <span className={cn("font-black text-lg md:text-xl", isCorrect ? "text-success" : "text-danger")}>
                                                        {userAnswer !== undefined ? q.options[userAnswer] : "Boş"}
                                                    </span>
                                                </div>
                                                {!isCorrect && (
                                                    <div className="p-6 md:p-8 bg-success/5 border-2 border-success/20 rounded-[1.5rem] md:rounded-[2rem] flex flex-col gap-1 md:gap-2">
                                                        <span className="text-[9px] md:text-[10px] uppercase font-black opacity-30 tracking-widest">Kararlı Yapı (Doğru)</span>
                                                        <span className="text-success font-black text-lg md:text-xl">{q.options[q.correctOption]}</span>
                                                    </div>
                                                )}
                                            </div>
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
        <div className="max-w-5xl w-full mx-auto px-6 md:px-12 relative">
            <AnimatePresence>
                {focusWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:w-auto"
                    >
                        <div className="bg-danger text-white px-10 py-6 rounded-[2rem] shadow-2xl flex items-center gap-6 border-4 border-white/20">
                            <AlertTriangle className="h-8 w-8 animate-bounce" />
                            <div className="text-left">
                                <p className="text-sm font-black uppercase tracking-widest">Simülasyondan Ayrılma!</p>
                                <p className="font-bold">Hile tespit sistemi aktif. Odaklan kanka!</p>
                            </div>
                            <button onClick={() => setFocusWarning(false)} className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                                <Check className="h-6 w-6" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
            <div className="mb-12 md:mb-20 glass-morphism p-6 md:p-8 rounded-[2.5rem] md:rounded-[4rem] border-primary/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />

                <div className="flex justify-between items-center relative z-10 px-2 md:px-4 mb-6 md:mb-8">
                    <button onClick={() => { playSFX('click'); router.back(); }} className="p-4 md:p-5 bg-foreground/5 rounded-2xl md:rounded-3xl hover:bg-foreground/10 transition-universal border border-border-theme/30 shadow-lg">
                        <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                    <div className="text-center">
                        <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.5em] mb-1 md:mb-2">Simülasyon Seansı</p>
                        <h1 className="text-xl md:text-3xl font-black text-foreground truncate max-w-[150px] md:max-w-none">{subjectName}</h1>
                    </div>
                    <div className="bg-primary/10 px-4 md:px-6 py-2 md:py-3 rounded-2xl md:rounded-3xl border border-primary/20 shadow-inner">
                        <span className="text-xl md:text-2xl font-black text-primary">{currentIdx + 1}</span>
                        <span className="text-foreground/20 font-black mx-1 md:mx-2 text-lg md:text-xl">/</span>
                        <span className="text-foreground/40 font-black text-lg md:text-xl">{questions.length}</span>
                    </div>
                </div>

                <div className="relative h-6 md:h-10 bg-foreground/5 rounded-full md:rounded-[2rem] overflow-hidden p-1 md:p-2 border border-border-theme/20 shadow-2xl">
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

                        <div className="absolute top-8 left-8 md:top-12 md:left-12 w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white font-black text-2xl md:text-4xl shadow-2xl rotate-3">
                            {currentIdx + 1}
                        </div>

                        <div className="mb-12 md:mb-20 pt-16 md:pt-12">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl md:text-5xl font-black text-foreground leading-[1.2] tracking-tight"
                            >
                                {currentQuestion.text}
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
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
                                            "w-full text-left p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 md:border-4 transition-universal flex items-center group relative overflow-hidden",
                                            isSelected
                                                ? "border-primary bg-primary/20 shadow-2xl shadow-primary/20 scale-[1.02]"
                                                : "border-border-theme/40 hover:border-primary/40 hover:bg-white/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] flex items-center justify-center font-black mr-4 md:mr-8 transition-universal shadow-2xl grow-0 shrink-0 text-lg md:text-2xl",
                                            isSelected
                                                ? "bg-primary text-white scale-110 rotate-6 shadow-primary/40"
                                                : "bg-foreground/5 text-foreground/40 group-hover:bg-primary/20 group-hover:text-primary group-hover:rotate-12"
                                        )}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={cn(
                                            "text-lg md:text-3xl font-black transition-colors flex-1",
                                            isSelected ? "text-foreground" : "text-foreground/60"
                                        )}>
                                            {option}
                                        </span>
                                        {isSelected && (
                                            <motion.div
                                                layoutId="active-particle"
                                                className="absolute right-6 md:right-10 h-4 w-4 md:h-6 md:w-6 rounded-full bg-primary aura-primary shadow-[0_0_20px_var(--primary)]"
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
            <div className="fixed bottom-6 left-0 right-0 px-6 z-50 lg:relative lg:bottom-auto lg:px-0 lg:mt-20 lg:mb-12">
                <div className="max-w-5xl mx-auto flex items-center gap-4 md:gap-6">
                    <button
                        onClick={prevQuestion}
                        disabled={currentIdx === 0}
                        className="p-6 md:p-8 bg-glass-morphism backdrop-blur-3xl text-foreground/40 hover:bg-foreground/10 rounded-2xl md:rounded-[2.5rem] disabled:opacity-0 transition-universal border border-border-theme/40 shadow-2xl active:scale-90"
                    >
                        <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" />
                    </button>

                    {currentIdx === questions.length - 1 ? (
                        <button
                            onClick={handleFinish}
                            disabled={submitting || answers[currentIdx] === undefined}
                            className="flex-1 py-6 md:py-9 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-[1.5rem] md:rounded-[3rem] font-black flex items-center justify-center gap-4 md:gap-6 transition-universal hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-2xl shadow-primary/40 text-lg md:text-2xl"
                        >
                            {submitting ? <RefreshCcw className="h-6 w-6 md:h-8 md:w-8 animate-spin" /> : (
                                <>
                                    <Sparkles className="h-6 w-6 md:h-8 md:w-8" />
                                    SEANSI BİTİR
                                    <Flag className="h-6 w-6 md:h-8 md:w-8" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            disabled={answers[currentIdx] === undefined}
                            className="flex-1 py-6 md:py-9 bg-foreground text-background dark:bg-white dark:text-black rounded-[1.5rem] md:rounded-[3rem] font-black flex items-center justify-center gap-4 md:gap-6 transition-universal hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-2xl text-lg md:text-2xl"
                        >
                            İLERLE
                            <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
