"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, Award, ArrowRight, Search } from "lucide-react";
import UserStats from "@/components/UserStats";
import Leaderboard from "@/components/Leaderboard";
import DailyQuestion from "@/components/DailyQuestion";
import SmartFeedback from "@/components/SmartFeedback";
import { motion, AnimatePresence } from "framer-motion";

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

        setData({ stats, subjects, user: stats.user });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data || !data.subjects) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <p className="text-xl font-bold text-foreground mb-4">Veriler yüklenemedi.</p>
      <button onClick={() => window.location.reload()} className="px-6 py-3 bg-primary text-white rounded-xl">Tekrar Dene</button>
    </div>
  );

  const { subjects, user } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20"
    >
      <Navbar user={{
        name: user?.name,
        level: user?.level || 1,
        points: user?.points || 0,
        streak: user?.streak || 0
      }} />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-black tracking-tight"
            >
              Hoş Geldin, <span className="text-primary">{user?.name || "Kullanıcı"}</span>
            </motion.h1>
            <p className="mt-4 text-lg text-foreground/60 font-medium max-w-2xl">
              KimyaLAB platformunda ilerlemeni takip et ve bugünkü hedeflerine ulaş.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="glass px-6 py-4 rounded-3xl text-center min-w-[120px]">
              <p className="text-xs font-bold text-foreground/40 uppercase mb-1">Başarı Puanı</p>
              <p className="text-2xl font-black text-primary">%{data.stats?.avgScore || 0}</p>
            </div>
            <div className="glass px-6 py-4 rounded-3xl text-center min-w-[120px]">
              <p className="text-xs font-bold text-foreground/40 uppercase mb-1">XP Puanı</p>
              <p className="text-2xl font-black text-accent">{user?.points || 0}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-20">
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-2 space-y-8"
          >
            <DailyQuestion />
            <SmartFeedback />
          </motion.section>

          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <UserStats />
            <Leaderboard />
          </motion.section>
        </div>

        <section id="topics">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-widest text-primary">Keşfet</h2>
              </div>
              <h2 className="text-4xl font-black mb-4">Konu Seç ve Başla</h2>
              <p className="text-lg text-foreground/60 font-medium">Uzmanlaşmak istediğin kimya konusunu seç ve testlere başla.</p>
            </div>

            <div className="relative group min-w-[300px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Konu ara..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-border-theme/50 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground placeholder-foreground/30"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {subjects
                .filter((s: any) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((subject: any, idx: number) => (
                  <motion.div
                    key={subject.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={`/quiz/${subject.id}`}
                      className="group relative block h-full p-8 glass rounded-3xl border border-border-theme hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20 translate-y-0 group-hover:-translate-y-1 transition-transform">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Award className="h-6 w-6 text-primary/60" />
                          </div>
                        </div>

                        <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors capitalize">
                          {subject.name}
                        </h3>

                        <div className="flex items-center gap-3 text-sm font-bold text-foreground/40 uppercase tracking-tighter">
                          <span>{subject._count?.questions || 0} Soru</span>
                          <span className="h-1 w-1 bg-foreground/20 rounded-full" />
                          <span className="text-primary/60">+100 XP Mümkün</span>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border-theme flex items-center justify-between">
                          <span className="text-primary font-black flex items-center gap-2">
                            Teste Başla
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </AnimatePresence>
            {subjects.filter((s: any) => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-foreground/40 font-medium italic">Aramanızla eşleşen konu bulunamadı.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
