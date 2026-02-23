"use client";

import { useEffect, useState } from "react";
import { History, Target, TrendingUp, Star, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UserStats() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/stats")
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setStats({ totalTests: 0, avgScore: 0, lastAttempts: [], topicStats: [] });
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-foreground/5 rounded-3xl"></div>)}
        </div>
    );

    const safeStats = stats || { totalTests: 0, avgScore: 0, lastAttempts: [], topicStats: [] };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                <StatCard
                    icon={<Target className="text-white" />}
                    label="Toplam Test"
                    value={safeStats.totalTests || 0}
                    color="bg-primary shadow-primary/20"
                    index={0}
                />
                <StatCard
                    icon={<TrendingUp className="text-white" />}
                    label="Ortalama Puan"
                    value={`%${safeStats.avgScore || 0}`}
                    color="bg-secondary shadow-secondary/20"
                    index={1}
                />
            </div>

            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-3xl"
                >
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        Son Denemeler
                    </h3>
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {(safeStats.lastAttempts || []).map((attempt: any, idx: number) => (
                                <motion.div
                                    key={attempt.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl border border-border-theme hover:border-primary/30 transition-colors"
                                >
                                    <div>
                                        <p className="font-bold text-foreground">{attempt.subject?.name || "Konu"}</p>
                                        <p className="text-xs text-foreground/40 font-medium">{new Date(attempt.date).toLocaleDateString("tr-TR")}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-primary">%{attempt.score}</p>
                                        <p className="text-[10px] font-black uppercase text-foreground/30">{attempt.correct}D • {attempt.wrong}Y</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {(!safeStats.lastAttempts || safeStats.lastAttempts.length === 0) && (
                            <p className="text-foreground/40 text-center py-8 font-medium italic">Henüz deneme bulunmuyor.</p>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-8 rounded-3xl"
                >
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                        <Star className="h-5 w-5 text-accent" />
                        Konu Bazlı Başarı
                    </h3>
                    <div className="space-y-6">
                        {(safeStats.topicStats || []).map((topic: any, idx: number) => (
                            <motion.div
                                key={topic.name}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="flex justify-between items-end mb-3">
                                    <p className="font-bold text-foreground/80">{topic.name}</p>
                                    <p className="text-sm font-black text-primary">%{topic.avgScore}</p>
                                </div>
                                <div className="w-full bg-foreground/10 rounded-full h-3 overflow-hidden p-[2px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.round(topic.avgScore || 0)}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                                    />
                                </div>
                                <div className="mt-2 flex items-center justify-between text-[10px] font-black uppercase text-foreground/40 tracking-wider">
                                    <span>{(topic.count || 0)} test çözüldü</span>
                                    {topic.avgScore > 70 ? (
                                        <span className="flex items-center gap-1 text-primary">
                                            <Award className="h-3 w-3" /> Uzmanlaşıldı
                                        </span>
                                    ) : (
                                        <span className="text-foreground/20">Geliştiriliyor</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color, index }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-3xl border-none shadow-xl shadow-primary/5 flex items-center gap-5 relative overflow-hidden group"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={cn("p-4 rounded-2xl shadow-lg", color)}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-black text-foreground/40 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-foreground">{value}</p>
            </div>
        </motion.div>
    );
}
