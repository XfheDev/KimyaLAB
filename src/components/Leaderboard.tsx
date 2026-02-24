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
        <div className="glass-morphism rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-universal" />

            <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="p-3 md:p-4 bg-gradient-to-br from-primary to-secondary rounded-xl md:rounded-2xl shadow-xl shadow-primary/20">
                    <Trophy className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-foreground">Kozmik Sıralama</h3>
                    <p className="text-[9px] md:text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mt-1">En İyi Operatörler</p>
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
                                    "group/item relative flex items-center justify-between p-6 md:p-8 2xl:p-10 rounded-[2rem] md:rounded-[3rem] border transition-universal overflow-hidden active-tactile tap-highlight-none",
                                    idx === 0 ? "bg-amber-500/10 border-amber-500/30 aura-accent scale-[1.02] md:scale-[1.05] z-10" :
                                        idx === 1 ? "bg-slate-400/10 border-slate-400/30" :
                                            idx === 2 ? "bg-amber-800/10 border-amber-800/30" :
                                                "bg-foreground/5 border-transparent hover:border-primary/20 hover:bg-primary/5 shadow-md"
                                )}
                            >
                                <div className="flex items-center gap-6 md:gap-10">
                                    <div className="relative">
                                        <div className={cn(
                                            "w-12 h-12 md:w-16 md:h-16 2xl:w-20 2xl:h-20 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center font-black text-xl md:text-3xl shadow-2xl transition-universal group-hover/item:scale-110 group-hover/item:rotate-6",
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
                                                className="absolute -top-4 -right-4"
                                            >
                                                <Crown className="h-8 w-8 md:h-10 md:w-10 text-amber-500 shadow-glow" />
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xl md:text-3xl font-black text-foreground group-hover/item:text-primary transition-colors truncate max-w-[150px] md:max-w-none tracking-tight">{user.name || "Operatör"}</p>
                                        <div className="flex items-center gap-3 mt-1 md:mt-2">
                                            <span className="text-xs font-black uppercase text-foreground/30 tracking-[0.2em] px-3 py-1 bg-foreground/5 rounded-lg border border-border-theme/20">Seviye {user.level}</span>
                                            {idx === 0 && <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.8)]" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {idx === 0 && <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-amber-500 animate-bounce" />}
                                        <p className="text-2xl md:text-4xl font-black text-primary group-hover/item:scale-110 transition-transform tracking-tighter">{user.points}</p>
                                        <span className="text-xs font-black text-secondary uppercase tracking-widest">XP</span>
                                    </div>
                                    {idx < 3 && <Medal className={cn("h-6 w-6 md:h-10 md:w-10 ml-auto mt-4 md:mt-6",
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
