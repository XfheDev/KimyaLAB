"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, Award, ArrowRight, Search, Sparkles, Target, Zap } from "lucide-react";
import UserStats from "@/components/UserStats";
import Leaderboard from "@/components/Leaderboard";
import DailyQuestion from "@/components/DailyQuestion";
import SmartFeedback from "@/components/SmartFeedback";
import SkeletonCard from "@/components/SkeletonCard";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch("/api/stats");
        const stats = await statsRes.json();

        const subjectsRes = await fetch("/api/subjects");
        const subjects = await subjectsRes.json();

        setData({
          stats,
          subjects: Array.isArray(subjects) ? subjects : [],
          user: stats?.user
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    const { subjects, user } = data || {};

    return (
      <div className="min-h-screen mesh-gradient text-foreground transition-all duration-700 pb-20 relative overflow-x-hidden">
        {/* Background Decorative Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full animate-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <Navbar user={{
          name: user?.name,
          level: user?.level || 1,
          points: user?.points || 0,
          streak: user?.streak || 0
        }} />

        <main className="max-w-7xl mx-auto py-12 px-6 lg:px-12 relative z-10">
          <header className="mb-20 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 mb-6"
              >
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Kimya Simülatörü Aktif</span>
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]"
              >
                Hoş Geldin, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{user?.name || "Kullanıcı"}</span>
              </motion.h1>
              <p className="mt-8 text-xl text-foreground/50 font-medium leading-relaxed max-w-xl">
                Geleceğin laboratuvarında bugün hangi elementleri keşfedeceksin? İlerlemene bak ve yeni testlere başla.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto"
            >
              <div className="glass-morphism p-8 rounded-[2.5rem] min-w-[200px] flex flex-col items-center justify-center group hover:scale-105 transition-all">
                <div className="p-4 bg-primary/20 rounded-2xl mb-4 text-primary group-hover:rotate-12 transition-transform shadow-lg shadow-primary/10">
                  <Target className="h-8 w-8" />
                </div>
                <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-1">Başarı Oranı</p>
                <p className="text-4xl font-black text-foreground">%{data?.stats?.avgScore || 0}</p>
              </div>

              <div className="glass-morphism p-8 rounded-[2.5rem] min-w-[200px] flex flex-col items-center justify-center group hover:scale-105 transition-all">
                <div className="p-4 bg-accent/20 rounded-2xl mb-4 text-accent group-hover:-rotate-12 transition-transform shadow-lg shadow-accent/10">
                  <Award className="h-8 w-8" />
                </div>
                <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-1">Toplam XP</p>
                <p className="text-4xl font-black text-foreground">{user?.points || 0}</p>
              </div>
            </motion.div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-24">
            <motion.section
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="xl:col-span-2 space-y-10"
            >
              <DailyQuestion />
              <SmartFeedback />
            </motion.section>

            <motion.section
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-10"
            >
              <UserStats />
              <Leaderboard />
            </motion.section>
          </div>

          <section id="topics">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Eğitim Modülleri</h2>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6">Hangi Konudan Başlıyoruz?</h2>
                <p className="text-xl text-foreground/40 font-medium">Uzmanlaşmak istediğin kimya modülünü seç ve zihnini test et.</p>
              </div>

              <div className="relative group w-full md:w-auto md:min-w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-foreground/30 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Örn: Atom Modelleri..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-6 bg-foreground/5 border-2 border-border-theme/40 rounded-[2.5rem] focus:outline-none focus:border-primary focus:ring-[12px] focus:ring-primary/10 transition-all font-bold text-lg text-foreground placeholder-foreground/20 shadow-xl shadow-black/5"
                />
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <SkeletonCard />
                    </motion.div>
                  ))
                ) : (
                  subjects
                    .filter((s: any) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((subject: any, idx: number) => (
                      <motion.div
                        key={subject.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                      >
                        <Link href={`/quiz/${subject.id}`} className="block h-full group">
                          <TiltCard className="h-full">
                            <div className="relative h-full p-10 glass-morphism rounded-[3rem] border border-border-theme/40 group-hover:border-primary/60 transition-all duration-500 overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/20">
                              {/* Depth Decorators */}
                              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
                              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/5 blur-[60px] rounded-full group-hover:bg-secondary/20 transition-all duration-700" />

                              <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
                                <div className="flex items-center justify-between mb-10">
                                  <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    <BookOpen className="h-7 w-7 text-white" />
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Mevcut Soru</span>
                                    <span className="text-xl font-black text-foreground/60">{subject._count?.questions || 0}</span>
                                  </div>
                                </div>

                                <h3 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">
                                  {subject.name}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2 mb-10">
                                  <span className="px-3 py-1 bg-primary/10 text-[10px] font-black uppercase text-primary rounded-lg border border-primary/10">TYT</span>
                                  <span className="px-3 py-1 bg-secondary/10 text-[10px] font-black uppercase text-secondary rounded-lg border border-secondary/10">Kimya</span>
                                  <span className="px-3 py-1 bg-foreground/5 text-[10px] font-black uppercase text-foreground/40 rounded-lg">Temel Seviye</span>
                                </div>

                                <div className="mt-8 pt-8 border-t border-border-theme/30 flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.1em]">Ödül</span>
                                    <span className="text-lg font-black text-primary">+100 XP</span>
                                  </div>
                                  <div className="w-14 h-14 rounded-full border border-border-theme/40 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all shadow-lg">
                                    <ArrowRight className="h-6 w-6 text-foreground/40 group-hover:text-white transition-all group-hover:translate-x-1" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TiltCard>
                        </Link>
                      </motion.div>
                    ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>
      </div>
    );
  };

  return renderContent();
}
