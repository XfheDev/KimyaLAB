"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, Award, ArrowRight, Search, Sparkles, Target, Zap } from "lucide-react";
import UserStats from "@/components/UserStats";
import Leaderboard from "@/components/Leaderboard";
import DailyQuestion from "@/components/DailyQuestion";
import SmartFeedback from "@/components/SmartFeedback";
import SkeletonCard from "@/components/SkeletonCard";
import NoteSystem from "@/components/NoteSystem";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useAudio } from "@/components/AudioProvider";

function Atom({ className, scale = 1, delay = 0, level = 1 }: { className?: string, scale?: number, delay?: number, level?: number }) {
  const orbitDuration = Math.max(2, 12 - (level * 0.5));

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        scale: scale,
        rotate: 360
      }}
      transition={{
        opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 2, delay },
        rotate: { duration: orbitDuration, repeat: Infinity, ease: "linear" }
      }}
    >
      <circle cx="50" cy="50" r="10" fill="currentColor" />
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(120 50 50)" />
    </motion.svg>
  );
}

function TiltCard({ children, className, onHover, isLocked = false }: { children: React.ReactNode, className?: string, onHover?: () => void, isLocked?: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { playSFX } = useAudio();

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLocked) return;
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

  const handleMouseEnter = () => {
    if (isLocked) {
      playSFX('error');
      return;
    }
    playSFX('click');
    onHover?.();
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
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
  const { scrollY } = useScroll();
  const yAtoms = useTransform(scrollY, [0, 1000], [0, -200]);

  const [accentColor, setAccentColor] = useState<string>("79, 70, 229");
  const { playSFX } = useAudio();

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

  const changeAccent = (color: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--primary-rgb', color);
    document.documentElement.style.setProperty('--primary', `rgb(${color})`);
  };

  const subjectStyles = [
    "79, 70, 229", // Indigo
    "147, 51, 234", // Purple
    "236, 72, 153", // Pink
    "249, 115, 22", // Orange
    "16, 185, 129", // Emerald
    "6, 182, 212", // Cyan
  ];

  const renderContent = () => {
    const { subjects, user } = data || {};
    const currentLevel = user?.level || 1;

    return (
      <div className="min-h-screen mesh-gradient text-foreground transition-universal pb-24 relative overflow-x-hidden">
        <motion.div style={{ y: yAtoms }} className="fixed inset-0 pointer-events-none z-0">
          <Atom className="absolute top-[15%] left-[5%] w-32 h-32 text-primary/10" scale={1.2} delay={0.1} level={currentLevel} />
          <Atom className="absolute top-[60%] left-[85%] w-48 h-48 text-secondary/10" scale={1.5} delay={0.5} level={currentLevel} />
          <Atom className="absolute top-[80%] left-[15%] w-24 h-24 text-accent/10" scale={0.8} delay={0.3} level={currentLevel} />
          <div className="absolute top-[40%] left-[50%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full animate-pulse-ring" />
        </motion.div>

        <Navbar user={user ? {
          name: user.name,
          level: user.level,
          points: user.points,
          streak: user.streak
        } : {}} />

        <main className="max-w-7xl mx-auto py-12 px-6 lg:px-12 relative z-10">
          <header className="mb-24 flex flex-col lg:flex-row lg:items-center justify-between gap-16">
            <div className="max-w-3xl">
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8"
              >
                Geleceğin <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">Laboratuvarı</span>
              </motion.h1>
              <p className="text-lg md:text-2xl text-foreground/50 font-medium leading-relaxed max-w-2xl px-2">
                Moleküler düzeyde öğrenme deneyimi. Bugün hangi elementi parçalayıp yeniden inşa edeceksin?
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col sm:flex-row gap-8 w-full lg:w-auto"
            >
              {[
                { icon: <Award className="h-8 w-8 md:h-10 md:w-10" />, label: "Deneyim", val: user?.points || 0, color: "bg-accent/20 text-accent" }
              ].map((item, i) => (
                <div key={i} className="glass-morphism p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] min-w-[200px] md:min-w-[240px] flex flex-col items-center justify-center group hover:scale-105 transition-universal shadow-2xl">
                  <div className={`p-4 md:p-5 rounded-2xl md:rounded-3xl mb-4 md:mb-5 ${item.color} group-hover:rotate-12 transition-transform shadow-xl`}>
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-1 md:mb-2">{item.label}</p>
                  <p className="text-4xl md:text-5xl font-black text-foreground">{item.val}</p>
                </div>
              ))}
            </motion.div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 mb-32">
            <motion.section
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="xl:col-span-2 space-y-12"
            >
              <DailyQuestion />
              <SmartFeedback />
              <NoteSystem />
            </motion.section>

            <motion.section
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-12"
            >
              <UserStats />
              <Leaderboard />
            </motion.section>
          </div>

          <section id="topics" className="relative">
            <header className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-16">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-2 w-24 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Kozmik Modüller</h2>
                </div>
                <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 leading-tight">Ustalık Yolculuğun</h2>
                <p className="text-lg md:text-2xl text-foreground/40 font-medium max-w-xl">Bugün moleküler düzeyde hangi konuyu keşfedeceksin?</p>
              </div>

              <div className="relative group w-full lg:w-auto lg:min-w-[500px]">
                <div className="absolute inset-y-0 left-0 pl-6 md:pl-8 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 md:h-8 md:w-8 text-foreground/20 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Element ara..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 md:pl-20 pr-6 md:pr-8 py-6 md:py-8 bg-foreground/5 border-2 border-border-theme/40 rounded-[2rem] md:rounded-[3rem] focus:outline-none focus:border-primary focus:ring-[10px] md:focus:ring-[20px] focus:ring-primary/5 transition-universal font-black text-lg md:text-xl text-foreground placeholder-foreground/10 shadow-2xl"
                />
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <SkeletonCard />
                    </motion.div>
                  ))
                ) : (
                  (subjects || [])
                    .filter((s: any) => s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((subject: any, idx: number) => {
                      return (
                        <motion.div
                          key={subject.id}
                          layout
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
                        >
                          <Link href={`/quiz/${subject.id}`} className="block h-full">
                            <TiltCard
                              className="h-full"
                              onHover={() => changeAccent(subjectStyles[idx % subjectStyles.length])}
                            >
                              <div className="relative h-full p-8 md:p-12 glass-morphism rounded-[3rem] md:rounded-[4rem] border border-border-theme/40 group hover:border-primary/60 transition-universal overflow-hidden shadow-2xl">
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/30 transition-universal" />
                                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full group-hover:bg-secondary/30 transition-universal" />

                                <div className="relative z-10" style={{ transform: "translateZ(60px)" }}>
                                  <div className="flex items-center justify-between mb-8 md:mb-12">
                                    <div className="p-4 md:p-5 bg-gradient-to-br from-primary to-secondary rounded-2xl md:rounded-3xl shadow-2xl shadow-primary/30 group-hover:scale-110 group-hover:rotate-12 transition-universal">
                                      <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-white" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] mb-1 md:mb-2">Atom Sayısı</span>
                                      <span className="text-2xl md:text-3xl font-black text-foreground/50">{subject._count?.questions || 0}</span>
                                    </div>
                                  </div>

                                  <h3 className="text-3xl md:text-4xl font-black mb-4 md:mb-6 group-hover:text-primary transition-colors leading-[1.1]">
                                    {subject.name}
                                  </h3>

                                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-8 md:mb-12">
                                    <span className="px-4 md:px-5 py-2 bg-primary/10 text-[9px] md:text-[10px] font-black uppercase text-primary rounded-lg md:rounded-xl border border-primary/10">TYT-ULTRA</span>
                                    <span className="px-4 md:px-5 py-2 bg-secondary/10 text-[9px] md:text-[10px] font-black uppercase text-secondary rounded-lg md:rounded-xl border border-secondary/10">Kimya</span>
                                  </div>

                                  <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-border-theme/30 flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-1">Potansiyel</span>
                                      <span className="text-xl md:text-2xl font-black text-primary text-glow">+1000 XP</span>
                                    </div>
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-border-theme/40 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-universal shadow-xl">
                                      <ArrowRight className="h-6 w-6 md:h-8 md:w-8 text-foreground/20 group-hover:text-white transition-universal group-hover:translate-x-2" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TiltCard>
                          </Link>
                        </motion.div>
                      );
                    })
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
