"use client";

import { useEffect, useState } from "react";
import { BarChart3, History, Target, TrendingUp, Star, Award, Shield, Activity, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UserStats() {
    const [stats, setStats] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [sRes, aRes] = await Promise.all([
                    fetch("/api/stats"),
                    fetch("/api/analytics")
                ]);
                const sData = await sRes.json();
                const aData = await aRes.json();

                setStats(sData);
                setAnalytics(aData);
            } catch (err) {
                console.error(err);
                setStats({ totalTests: 0, avgScore: 0, lastAttempts: [], topicStats: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
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
                    icon={<Activity className="text-white" />}
                    label="Haftalık Aktivite"
                    value={analytics?.totalLogs || 0}
                    subLabel="İşlem Kaydı"
                    color="bg-primary shadow-primary/20"
                    index={0}
                />
                <StatCard
                    icon={<Award className="text-white" />}
                    label="Başarımlar"
                    value={analytics?.achievementCount || 0}
                    subLabel="Kazanılan Rozet"
                    color="bg-secondary shadow-secondary/20"
                    index={1}
                />
            </div>

            <div className="space-y-6">
                {/* Activity Heatmap Mockup / Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism p-8 rounded-[3rem] border border-primary/20 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2 relative z-10">
                        <Calendar className="h-5 w-5 text-primary" />
                        Galaktik Aktivite
                    </h3>
                    <div className="flex gap-2 relative z-10">
                        {Array.from({ length: 7 }).map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (6 - i));
                            const dateStr = date.toISOString().split('T')[0];
                            const count = analytics?.activityByDay?.[dateStr] || 0;
                            const intensity = Math.min(count * 20, 100);

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full aspect-square rounded-lg border border-border-theme/30 transition-universal hover:scale-110"
                                        style={{
                                            backgroundColor: count > 0 ? `rgba(var(--primary-rgb), ${0.1 + (intensity / 100) * 0.9})` : 'rgba(var(--foreground-rgb), 0.05)'
                                        }}
                                        title={`${dateStr}: ${count} işlem`}
                                    />
                                    <span className="text-[8px] font-black uppercase text-foreground/20">{date.toLocaleDateString('tr-TR', { weekday: 'short' })}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

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
                        <Shield className="h-5 w-5 text-accent" />
                        Backend Doğrulamalı Başarı
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
                                    {topic.avgScore >= 70 ? (
                                        <span className="flex items-center gap-1 text-primary">
                                            <Shield className="h-3 w-3" /> Yetkin
                                        </span>
                                    ) : (
                                        <span className="text-foreground/20">Eğitimde</span>
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

function StatCard({ icon, label, value, subLabel, color, index }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism p-8 rounded-[2.5rem] border-primary/10 shadow-xl flex items-center gap-6 relative overflow-hidden group h-full"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={cn("p-5 rounded-2xl shadow-lg", color)}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-foreground">{value}</p>
                    <p className="text-[10px] font-black text-foreground/20 uppercase">{subLabel}</p>
                </div>
            </div>
        </motion.div>
    );
}
