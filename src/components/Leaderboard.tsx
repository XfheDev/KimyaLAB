"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardUser {
    id: string;
    name: string;
    points: number;
    level: number;
}

export default function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

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
        <div className="glass rounded-[2.5rem] p-8 h-full flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="glass rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all border border-border-theme/50">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-2xl">
                    <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-foreground">Global Sıralama</h3>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {users.map((user, idx) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative flex items-center justify-between p-4 bg-foreground/5 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${idx === 0 ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" :
                                            idx === 1 ? "bg-slate-400 text-white" :
                                                idx === 2 ? "bg-amber-700 text-white" :
                                                    "bg-foreground/10 text-foreground/40"
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    {idx === 0 && <Crown className="absolute -top-2 -right-2 h-4 w-4 text-amber-500 animate-bounce" />}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{user.name || "Anonim"}</p>
                                    <p className="text-[10px] font-black uppercase text-foreground/40 tracking-wider">Seviye {user.level}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-primary">{user.points} XP</p>
                                {idx < 3 && <Medal className={`h-4 w-4 ml-auto mt-1 ${idx === 0 ? "text-amber-500" :
                                        idx === 1 ? "text-slate-400" :
                                            "text-amber-700"
                                    }`} />}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {users.length === 0 && (
                    <p className="text-center py-8 text-foreground/40 italic">Henüz veri bulunamadı.</p>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-border-theme/50">
                <p className="text-center text-xs font-medium text-foreground/30">
                    Sıralama her 5 dakikada bir güncellenir.
                </p>
            </div>
        </div>
    );
}
