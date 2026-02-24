"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import UserStats from "@/components/UserStats";
import SmartFeedback from "@/components/SmartFeedback";
import { Target, Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch("/api/stats")
            .then(res => res.json())
            .then(data => setUser(data.user));
    }, []);

    return (
        <div className="min-h-screen mesh-gradient text-foreground pb-24">
            <Navbar user={user || {}} />

            <main className="max-w-7xl mx-auto py-12 px-6 lg:px-12">
                <header className="mb-24">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-2 w-32 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
                        <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary">Kuantum Veriler</h2>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">Moleküler <br /> Analiz</h2>
                    <p className="text-xl md:text-3xl text-foreground/40 font-medium max-w-2xl">Öğrenme sürecini verilerle optimize et ve eksiklerini keşfet.</p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    <div className="xl:col-span-2 space-y-12">
                        <SmartFeedback />
                        <UserStats />
                    </div>
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-morphism p-10 rounded-[3rem] border border-border-theme/40 text-center"
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Activity className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">Verim Oranı</h3>
                            <p className="text-5xl font-black text-foreground mb-2">%85</p>
                            <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest leading-loose">Haftalık Ortalama Başarı</p>
                        </motion.div>

                        <div className="glass-morphism p-8 rounded-[3rem] border border-border-theme/40">
                            <div className="flex items-center gap-4 mb-6">
                                <Target className="h-6 w-6 text-secondary" />
                                <h4 className="font-black uppercase text-sm tracking-widest text-foreground/70">Odak Noktası</h4>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                        <span className="text-foreground/40">Modern Atom Teorisi</span>
                                        <span className="text-secondary">%92</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary w-[92%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                        <span className="text-foreground/40">Kimyasal Hesaplamalar</span>
                                        <span className="text-primary">%45</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[45%]" />
                                    </div>
                                </div>
                            </div>
                            <p className="mt-8 text-xs font-medium text-foreground/40 italic text-center">"Daha dengeli bir başarı için zayıf halkalara odaklan."</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
