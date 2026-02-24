"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, Award, ArrowRight, Search, Sparkles, Target, Zap } from "lucide-react";
import UserStats from "@/components/UserStats";
import DailyQuestion from "@/components/DailyQuestion";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useAudio } from "@/components/AudioProvider";
import Logo from "@/components/Logo";

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
                className="text-5xl sm:text-7xl md:text-8xl 2xl:text-[9rem] font-black tracking-tighter leading-[0.9] mb-8"
              >
                Geleceğin <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">Laboratuvarı</span>
              </motion.h1>
              <p className="text-xl md:text-3xl text-foreground/50 font-medium leading-relaxed max-w-2xl px-2">
                Moleküler düzeyde öğrenme deneyimi. Bugün hangi elementi parçalayıp yeniden inşa edeceksin?
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative hidden lg:block animate-float-molecule"
            >
              <Logo className="h-64 w-64 md:h-80 md:w-80 2xl:h-[32rem] 2xl:w-[32rem]" />
              <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse" />
            </motion.div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <Link href="/academy" className="active-tactile tap-highlight-none">
                  <div className="glass-morphism p-12 rounded-[4rem] border border-primary/20 hover:border-primary transition-all group relative overflow-hidden h-full shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BookOpen className="h-32 w-32" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Eğitim Merkezi</p>
                    <h3 className="text-4xl font-black mb-6">Akademi</h3>
                    <p className="text-foreground/40 text-lg leading-relaxed mb-10">Tüm kimya modüllerine buradan ulaşabilir ve deneylerine devam edebilirsin.</p>
                    <div className="flex items-center gap-3 text-primary font-black text-sm uppercase tracking-widest">
                      Keşfetmeye Başla <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>

                <Link href="/analytics" className="active-tactile tap-highlight-none">
                  <div className="glass-morphism p-12 rounded-[4rem] border border-secondary/20 hover:border-secondary transition-all group relative overflow-hidden h-full shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Zap className="h-32 w-32" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-secondary mb-6">Kişisel Gelişim</p>
                    <h3 className="text-4xl font-black mb-6">Analiz</h3>
                    <p className="text-foreground/40 text-lg leading-relaxed mb-10">Hangi konularda daha güçlü olduğunu ve moleküler eksiklerini gör.</p>
                    <div className="flex items-center gap-3 text-secondary font-black text-sm uppercase tracking-widest">
                      Verileri İncele <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>
              </div>
            </motion.section>

            <motion.section
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-12"
            >
              <UserStats />
              <Link href="/leaderboard">
                <div className="glass-morphism p-8 rounded-[3rem] border border-border-theme/40 hover:bg-foreground/5 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Award className="h-6 w-6 text-accent" />
                      <span className="font-black uppercase tracking-widest text-xs">Sıralama</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-foreground/20 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-sm text-foreground/50">Diğer kimyagerler arasındaki yerini gör ve zirveye tırman.</p>
                </div>
              </Link>
            </motion.section>
          </div>

        </main>
      </div>
    );
  };

  return renderContent();
}
