"use client";

import { useEffect, useState } from "react";
import Leaderboard from "@/components/Leaderboard";
import { Trophy, Star, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen mesh-gradient text-foreground pb-24">
            <main className="max-w-7xl mx-auto py-12 px-6 lg:px-12">
                <header className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-2 w-24 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Atomik Rekabet</h2>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black mb-6 leading-tight">Liderlik Tablosu</h2>
                    <p className="text-lg md:text-2xl text-foreground/40 font-medium max-w-xl">En çok bağ kuran ve en yüksek enerji seviyesine ulaşan simyacılar.</p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    <div className="xl:col-span-2">
                        <Leaderboard />
                    </div>
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-morphism p-8 rounded-[3rem] border border-border-theme/40"
                        >
                            <Trophy className="h-10 w-10 text-accent mb-6" />
                            <h3 className="text-2xl font-black mb-4">Üstünlük Kur</h3>
                            <p className="text-foreground/50 text-sm leading-relaxed mb-6">Her gün yeni bir soru çözerek ve testleri %100 doğrulukla tamamlayarak sıralamada yükselebilirsin.</p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Star className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-foreground/70">+50 XP Günlük Bonus</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <Award className="h-4 w-4 text-secondary" />
                                    </div>
                                    <span className="text-xs font-bold text-foreground/70">Kusursuz Test: +100 XP</span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="p-8 rounded-[3rem] bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
                            <p className="text-sm font-black uppercase tracking-widest text-primary mb-2">Senin Durumun</p>
                            <p className="text-4xl font-black text-foreground">Sıralama Bekleniyor</p>
                            <p className="text-xs font-bold text-foreground/40 mt-2">Daha fazla test çözerek listeye gir!</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
