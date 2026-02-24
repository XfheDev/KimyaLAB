"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, ArrowRight, Search } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAudio } from "@/components/AudioProvider";

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

export default function AcademyPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { playSFX } = useAudio();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await fetch("/api/stats");
                const stats = await statsRes.json();

                const subjectsRes = await fetch("/api/subjects");
                const subjects = await subjectsRes.json();

                setData({
                    user: stats?.user,
                    subjects: Array.isArray(subjects) ? subjects : []
                });
            } catch (err) {
                console.error("Academy fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const subjectStyles = [
        "79, 70, 229", // Indigo
        "147, 51, 234", // Purple
        "236, 72, 153", // Pink
        "249, 115, 22", // Orange
        "16, 185, 129", // Emerald
        "6, 182, 212", // Cyan
    ];

    const changeAccent = (color: string) => {
        document.documentElement.style.setProperty('--primary-rgb', color);
        document.documentElement.style.setProperty('--primary', `rgb(${color})`);
    };

    const { subjects, user } = data || {};

    return (
        <div className="min-h-screen mesh-gradient text-foreground pb-24">
            <Navbar user={user || {}} />

            <main className="max-w-7xl mx-auto py-12 px-6 lg:px-12">
                <header className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-16">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-2 w-24 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Kozmik Modüller</h2>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 leading-tight">Kimya Akademisi</h2>
                        <p className="text-lg md:text-2xl text-foreground/40 font-medium max-w-xl">Tüm konulara buradan ulaşabilir ve uzmanlaşmaya başlayabilirsin.</p>
                    </div>

                    <div className="relative group w-full lg:w-auto lg:min-w-[600px]">
                        <div className="absolute inset-y-0 left-0 pl-8 md:pl-10 flex items-center pointer-events-none">
                            <Search className="h-8 w-8 md:h-10 md:w-10 text-foreground/20 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Konu veya element ara..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-20 md:pl-24 pr-8 md:pr-10 py-8 md:py-10 bg-foreground/5 border-2 border-border-theme/40 rounded-[2.5rem] md:rounded-[4rem] focus:outline-none focus:border-primary focus:ring-[15px] md:focus:ring-[30px] focus:ring-primary/5 transition-universal font-black text-xl md:text-2xl text-foreground placeholder-foreground/10 shadow-2xl"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-12 md:gap-16 min-h-[600px]">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            Array.from({ length: 9 }).map((_, i) => (
                                <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <SkeletonCard />
                                </motion.div>
                            ))
                        ) : (
                            (subjects || [])
                                .filter((s: any) => s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((subject: any, idx: number) => (
                                    <motion.div
                                        key={subject.id}
                                        layout
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    >
                                        <Link href={`/quiz/${subject.id}`} className="block h-full active-tactile tap-highlight-none">
                                            <TiltCard
                                                className="h-full"
                                                onHover={() => changeAccent(subjectStyles[idx % subjectStyles.length])}
                                            >
                                                <div className="relative h-full p-10 md:p-14 glass-morphism rounded-[4rem] md:rounded-[5rem] border border-border-theme/40 group hover:border-primary/60 transition-universal overflow-hidden shadow-2xl">
                                                    <div className="relative z-10">
                                                        <div className="flex items-center justify-between mb-10 md:mb-14">
                                                            <div className="p-6 bg-gradient-to-br from-primary to-secondary rounded-[2rem] shadow-xl">
                                                                <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-white" />
                                                            </div>
                                                            <span className="text-3xl font-black text-foreground/50">{subject._count?.questions || 0} Soru</span>
                                                        </div>
                                                        <h3 className="text-4xl md:text-5xl font-black mb-6 md:mb-8 group-hover:text-primary transition-colors leading-[1.1]">{subject.name}</h3>
                                                        <div className="flex gap-3 mb-12 md:mb-16">
                                                            <span className="px-5 py-2 bg-primary/10 text-xs font-black uppercase text-primary rounded-xl border border-primary/10">TYT</span>
                                                            <span className="px-5 py-2 bg-secondary/10 text-xs font-black uppercase text-secondary rounded-xl border border-secondary/10">Ultra</span>
                                                        </div>
                                                        <div className="flex items-center justify-between pt-10 md:pt-14 border-t border-border-theme/30">
                                                            <div>
                                                                <p className="text-xs font-black text-foreground/20 uppercase tracking-widest">Ödül</p>
                                                                <p className="text-2xl md:text-3xl font-black text-primary">+1000 XP</p>
                                                            </div>
                                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-border-theme/40 flex items-center justify-center group-hover:bg-primary transition-all shadow-xl">
                                                                <ArrowRight className="h-8 w-8 md:h-10 md:w-10 text-foreground/20 group-hover:text-white group-hover:translate-x-2 transition-all" />
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
            </main>
        </div>
    );
}
