"use client";

import { signOut } from "next-auth/react";
import { BookOpen, LogOut, Award, Star, Settings, Bookmark } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";

interface NavbarProps {
    user: {
        name?: string | null;
        level?: number;
        points?: number;
        streak?: number;
    };
}

export default function Navbar({ user }: NavbarProps) {
    return (
        <nav className="glass sticky top-0 z-50 border-b border-border-theme/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            className="p-2 bg-primary rounded-xl"
                        >
                            <BookOpen className="h-6 w-6 text-white" />
                        </motion.div>
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            KimyaLAB
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-foreground/5 rounded-2xl border border-border-theme">
                            <div className="flex items-center gap-1.5" title="Giriş Serisi">
                                <span className="text-lg">🔥</span>
                                <span className="text-sm font-bold text-foreground">
                                    {user.streak || 0} Gün
                                </span>
                            </div>
                            <div className="h-4 w-px bg-border-theme" />
                            <div className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 text-accent fill-accent" />
                                <span className="text-sm font-bold text-foreground">
                                    Seviye {user.level || 1}
                                </span>
                            </div>
                            <div className="h-4 w-px bg-border-theme" />
                            <div className="flex items-center gap-1.5">
                                <Award className="h-4 w-4 text-primary" />
                                <span className="text-sm font-bold text-foreground">
                                    {user.points || 0} XP
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="hidden sm:block text-sm text-foreground/60 font-medium">
                                {user.name || "Kullanıcı"}
                            </span>
                            <Link href="/saved" className="p-2 text-foreground/40 hover:text-primary transition-colors" title="Kaydedilenler">
                                <Bookmark className="h-5 w-5" />
                            </Link>
                            <Link href="/settings" className="p-2 text-foreground/40 hover:text-primary transition-colors" title="Ayarlar">
                                <Settings className="h-5 w-5" />
                            </Link>
                            <ThemeToggle />
                            <button
                                onClick={() => signOut()}
                                className="p-2 text-foreground/40 hover:text-red-500 transition-colors"
                                title="Çıkış Yap"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
