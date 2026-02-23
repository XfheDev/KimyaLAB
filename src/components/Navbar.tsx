"use client";

import { signOut } from "next-auth/react";
import { BookOpen, LogOut, Award, Star, Settings, Menu, X, ChevronDown, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="glass sticky top-4 z-50 mx-4 sm:mx-8 rounded-[2rem] border border-border-theme/40 mt-4 overflow-visible">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/25"
                    >
                        <BookOpen className="h-6 w-6 text-white" />
                    </motion.div>
                    <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary group-hover:opacity-80 transition-opacity">
                        KimyaLAB
                    </span>
                </Link>

                {/* Desktop Desktop Actions */}
                <div className="hidden lg:flex items-center gap-8">
                    {/* User Stats Card */}
                    <div className="flex items-center gap-1 p-1 bg-foreground/5 rounded-2xl border border-border-theme/30 backdrop-blur-sm">
                        <div className="flex items-center gap-2 px-4 py-1.5 hover:bg-foreground/5 rounded-xl transition-colors group cursor-default" title="Giriş Serisi">
                            <span className="text-xl group-hover:scale-125 transition-transform duration-300">🔥</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-foreground/40 leading-none">Seri</span>
                                <span className="text-sm font-black text-foreground">{user.streak || 0} Gün</span>
                            </div>
                        </div>
                        <div className="h-6 w-px bg-border-theme/50" />
                        <div className="flex items-center gap-2 px-4 py-1.5 hover:bg-foreground/5 rounded-xl transition-colors group cursor-default">
                            <Star className="h-4 w-4 text-accent fill-accent animate-pulse" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-foreground/40 leading-none">Seviye</span>
                                <span className="text-sm font-black text-foreground">{user.level || 1}</span>
                            </div>
                        </div>
                        <div className="h-6 w-px bg-border-theme/50" />
                        <div className="flex items-center gap-2 px-4 py-1.5 hover:bg-foreground/5 rounded-xl transition-colors group cursor-default">
                            <Award className="h-4 w-4 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-foreground/40 leading-none">Puan</span>
                                <span className="text-sm font-black text-foreground">{user.points || 0} XP</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={cn(
                                    "flex items-center gap-3 p-1.5 pr-4 rounded-2xl border transition-all duration-300",
                                    isProfileOpen
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                        : "bg-foreground/5 text-foreground border-border-theme hover:border-primary/50"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                    isProfileOpen ? "bg-white/20" : "bg-primary text-white"
                                )}>
                                    <UserCircle className="h-6 w-6" />
                                </div>
                                <span className="font-bold text-sm hidden xl:block uppercase tracking-wider">{user.name?.split(' ')[0] || "Profil"}</span>
                                <ChevronDown className={cn("h-4 w-4 transition-transform", isProfileOpen && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-56 glass rounded-3xl p-3 border border-border-theme shadow-2xl overflow-hidden"
                                        >
                                            <div className="p-4 mb-2 bg-foreground/5 rounded-2xl border border-border-theme/50">
                                                <p className="text-xs font-black text-foreground/40 uppercase mb-1">Hesabın</p>
                                                <p className="font-bold text-foreground truncate">{user.name || "Kullanıcı"}</p>
                                            </div>
                                            <Link
                                                href="/settings"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors text-foreground/70 font-bold"
                                            >
                                                <Settings className="h-5 w-5" />
                                                Ayarlar
                                            </Link>
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-colors text-foreground/70 font-bold mt-1"
                                            >
                                                <LogOut className="h-5 w-5" />
                                                Çıkış Yap
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Mobile Icons */}
                <div className="flex items-center gap-2 lg:hidden">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-3 bg-foreground/5 text-foreground rounded-2xl active:scale-90 transition-all border border-border-theme"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden border-t border-border-theme/20 overflow-hidden bg-background/80 backdrop-blur-2xl px-6 pb-6 rounded-b-[2rem]"
                    >
                        <div className="pt-6 space-y-6">
                            {/* Mobile Stats Grid */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center gap-2 p-4 bg-foreground/5 rounded-3xl border border-border-theme/30 group">
                                    <span className="text-2xl group-active:scale-125 transition-transform">🔥</span>
                                    <span className="text-[10px] font-black uppercase text-foreground/40">Giriş</span>
                                    <span className="text-sm font-black">{user.streak || 0}</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-accent/5 rounded-3xl border border-accent/20">
                                    <Star className="h-6 w-6 text-accent fill-accent" />
                                    <span className="text-[10px] font-black uppercase text-accent/40">Seviye</span>
                                    <span className="text-sm font-black text-accent">{user.level || 1}</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-primary/5 rounded-3xl border border-primary/20">
                                    <Award className="h-6 w-6 text-primary" />
                                    <span className="text-[10px] font-black uppercase text-primary/40">XP</span>
                                    <span className="text-sm font-black text-primary">{user.points || 0}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/settings"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-4 p-5 rounded-3xl bg-foreground/5 active:bg-foreground/10 transition-colors"
                                >
                                    <div className="p-3 bg-primary/20 rounded-2xl">
                                        <Settings className="h-6 w-6 text-primary" />
                                    </div>
                                    <span className="font-black text-lg">Hesap Ayarları</span>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="w-full flex items-center gap-4 p-5 rounded-3xl bg-red-500/5 active:bg-red-500/10 transition-colors text-red-500"
                                >
                                    <div className="p-3 bg-red-500/20 rounded-2xl">
                                        <LogOut className="h-6 w-6" />
                                    </div>
                                    <span className="font-black text-lg text-left">Oturumu Kapat</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
