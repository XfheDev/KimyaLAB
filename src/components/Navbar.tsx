"use client";

import { signOut } from "next-auth/react";
import { BookOpen, LogOut, Award, Star, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
    user: {
        name?: string | null;
        level?: number;
        points?: number;
        streak?: number;
    };
}

export default function Navbar({ user }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                            <div className="hidden sm:flex items-center gap-1">
                                <Link href="/settings" className="p-2 text-foreground/40 hover:text-primary transition-colors" title="Ayarlar">
                                    <Settings className="h-5 w-5" />
                                </Link>
                            </div>
                            <ThemeToggle />
                            <button
                                onClick={() => signOut()}
                                className="hidden sm:block p-2 text-foreground/40 hover:text-red-500 transition-colors"
                                title="Çıkış Yap"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="sm:hidden p-2 text-foreground/60 active:text-primary transition-colors"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-border-theme/50 overflow-hidden bg-background/95 backdrop-blur-xl"
                    >
                        <div className="p-4 space-y-4">
                            {/* Mobile Stats */}
                            <div className="flex justify-between items-center p-4 bg-foreground/5 rounded-2xl border border-border-theme">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xl">🔥</span>
                                    <span className="text-xs font-bold text-foreground/60">
                                        {user.streak || 0} Gün
                                    </span>
                                </div>
                                <div className="w-px h-8 bg-border-theme" />
                                <div className="flex flex-col items-center gap-1">
                                    <Star className="h-5 w-5 text-accent fill-accent" />
                                    <span className="text-xs font-bold text-foreground/60">
                                        Seviye {user.level || 1}
                                    </span>
                                </div>
                                <div className="w-px h-8 bg-border-theme" />
                                <div className="flex flex-col items-center gap-1">
                                    <Award className="h-5 w-5 text-primary" />
                                    <span className="text-xs font-bold text-foreground/60">
                                        {user.points || 0} XP
                                    </span>
                                </div>
                            </div>

                            {/* Mobile Links */}
                            <div className="grid grid-cols-1 gap-3">
                                <Link
                                    href="/settings"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-foreground/5 active:bg-foreground/10 transition-colors"
                                >
                                    <Settings className="h-5 w-5 text-primary" />
                                    <span className="font-bold text-foreground">Ayarlar</span>
                                </Link>
                            </div>

                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500/10 text-red-500 font-bold active:bg-red-500/20 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                Çıkış Yap
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
