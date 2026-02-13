"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Rocket, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function SmartFeedback() {
    const [feedback, setFeedback] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        recommendation: "Henüz hiç test çözmemişsin. Haydi, ilk konunu seç ve kimya yolculuğuna başla!",
        isNewUser: true
    } : feedback;

    if (!displayFeedback || displayFeedback.message === "Unauthorized") return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative glass border-accent/20 rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center gap-8 shadow-2xl shadow-accent/5 overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-30" />

            <div className="relative">
                <div className="p-6 bg-accent rounded-[2rem] shadow-xl shadow-accent/20 group-hover:rotate-6 transition-transform duration-500">
                    <Rocket className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-background rounded-full flex items-center justify-center shadow-md animate-bounce">
                    <Target className="h-3 w-3 text-accent" />
                </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                    <h4 className="text-sm font-black text-accent uppercase tracking-[0.2em]">Kişiselleştirilmiş Yol Haritası</h4>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 leading-tight">
                    Bir sonraki adımın hazır.
                </h3>
                <p className="text-lg text-foreground/60 leading-relaxed font-medium">
                    {displayFeedback.recommendation}
                </p>
            </div>

            <button
                onClick={() => window.location.href = '#topics'}
                className="px-8 py-5 bg-accent text-white rounded-2xl font-black hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/30 whitespace-nowrap flex items-center gap-2 group/btn"
            >
                Hemen Başla
                <Lightbulb className="h-5 w-5 group-hover/btn:fill-white transition-all" />
            </button>
        </motion.div>
    );
}
