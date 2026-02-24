"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Rocket, Target, Zap, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/AudioProvider";

export default function SmartFeedback() {
    const [feedback, setFeedback] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { playSFX } = useAudio();

    useEffect(() => {
        fetch("/api/feedback")
            .then(res => res.json())
            .then(data => {
                setFeedback(data);
                setLoading(false);
            })
            .catch(() => {
                setFeedback(null);
                setLoading(false);
            });
    }, []);

    if (loading) return null;

    const displayFeedback = feedback?.message === "No data yet" ? {
        recommendation: "Henüz hiçbir moleküler bağ kurmamışsın. İlk deney seansına başlamaya ne dersin?",
        isNewUser: true
    } : feedback;

    if (!displayFeedback || displayFeedback.message === "Unauthorized") return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative glass-morphism border-primary/20 rounded-[4rem] p-12 flex flex-col lg:flex-row items-center gap-12 shadow-2xl overflow-hidden"
        >
            {/* AI Pulse Animation / Background Decoration */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full group-hover:bg-primary/10 transition-universal" />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-20 -bottom-20 w-80 h-80 bg-accent/10 blur-[80px] rounded-full"
            />

            <div className="relative">
                <div className="p-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-[3.5rem] shadow-2xl shadow-primary/30 group-hover:rotate-6 group-hover:scale-105 transition-universal relative">
                    <Bot className="h-12 w-12 text-white animate-pulse" />

                    {/* Floating mini atoms */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-4 -right-4 p-2 bg-background rounded-full border border-border-theme shadow-lg"
                    >
                        <Zap className="h-4 w-4 text-accent" />
                    </motion.div>
                </div>
            </div>

            <div className="flex-1 text-center lg:text-left relative z-10">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                    <h4 className="text-sm font-black text-primary uppercase tracking-[0.4em]">Yapay Zeka Analiz Sistemi</h4>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="flex h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_vars(--primary)]"
                    />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
                    Kozmik Rota <br />
                    Belirlendi.
                </h3>
                <p className="text-2xl text-foreground/50 leading-relaxed font-medium max-w-xl">
                    "{displayFeedback.recommendation}"
                </p>
            </div>

            <button
                onClick={() => { playSFX('click'); window.location.href = '/academy'; }}
                className="px-12 py-8 bg-foreground text-background dark:bg-white dark:text-black rounded-[2.5rem] font-black hover:opacity-90 hover:scale-105 active:scale-95 transition-universal shadow-2xl whitespace-nowrap flex items-center gap-4 group/btn text-xl"
            >
                Deneye Başla
                <Lightbulb className="h-8 w-8 group-hover/btn:fill-current transition-all" />
            </button>
        </motion.div>
    );
}
