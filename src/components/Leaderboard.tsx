"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Crown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAudio } from "@/components/AudioProvider";

interface LeaderboardUser {
    id: string;
    name: string;
    points: number;
    level: number;
}

export default function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { playSFX } = useAudio();

    useEffect(() => {
        fetch("/api/leaderboard")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setUsers(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="glass-morphism rounded-[3rem] p-12 h-full flex flex-col items-center justify-center gap-6">
            <div className="h-16 w-16 border-8 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-[0.4em] text-primary animate-pulse">Evren Senkronize Ediliyor</p>
        </div>
    );

    return (
        <div className="glass-morphism rounded-[3rem] p-10 shadow-2xl border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-universal" />

            <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl shadow-primary/20">
                    <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-foreground">Kozmik Sıralama</h3>
                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mt-1">En İyi Simülatör Operatörleri</p>
                </div>
            </div>

            <div className="space-y-5">
                <AnimatePresence mode="popLayout">
                    {users.map((user, idx) => {
                        const isTopThree = idx < 3;
                        return (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, ease: "easeOut" }}
                                onMouseEnter={() => isTopThree && playSFX('click')}
                                className={cn(
                                    "group/item relative flex items-center justify-between p-6 rounded-[2rem] border transition-universal overflow-hidden",
                                    idx === 0 ? "bg-amber-500/10 border-amber-500/30 aura-accent scale-[1.05] z-10" :
                                        idx === 1 ? "bg-slate-400/10 border-slate-400/30" :
                                            idx === 2 ? "bg-amber-800/10 border-amber-800/30" :
                                                "bg-foreground/5 border-transparent hover:border-primary/20 hover:bg-primary/5"
                                )}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl transition-universal group-hover/item:scale-110 group-hover/item:rotate-6",
                                            idx === 0 ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white" :
                                                idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 text-white" :
                                                    idx === 2 ? "bg-gradient-to-br from-amber-700 to-amber-900 text-white" :
                                                        "bg-foreground/10 text-foreground/40"
                                        )}>
                                            {idx + 1}
                                        </div>
                                        {idx === 0 && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                                className="absolute -top-3 -right-3"
                                            >
                                                <Crown className="h-6 w-6 text-amber-500 shadow-glow" />
                                            </motion.div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-foreground group-hover/item:text-primary transition-colors">{user.name || "İsimsiz Operatör"}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase text-foreground/30 tracking-widest px-2 py-0.5 bg-foreground/5 rounded-md">Seviye {user.level}</span>
                                            {idx === 0 && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {idx === 0 && <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />}
                                        <p className="text-xl font-black text-primary group-hover/item:scale-110 transition-transform">{user.points}</p>
                                        <span className="text-[10px] font-black text-secondary">XP</span>
                                    </div>
                                    {idx < 3 && <Medal className={cn("h-5 w-5 ml-auto mt-2",
                                        idx === 0 ? "text-amber-500" :
                                            idx === 1 ? "text-slate-400" :
                                                "text-amber-700"
                                    )} />}
                                </div>

                                {idx === 0 && (
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {users.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center opacity-30">
                        <Trophy className="h-16 w-16 mb-4" />
                        <p className="text-lg font-black uppercase tracking-widest italic">Veri Akışı Yok</p>
                    </div>
                )}
            </div>

            <div className="mt-10 pt-8 border-t border-border-theme/40 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">
                    Kozmik veriler 5 dakikada bir senkronize edilir.
                </p>
            </div>
        </div>
    );
}
