"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Sparkles, FlaskConical } from "lucide-react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, password }),
        });

        setLoading(false);

        if (res.ok) {
            router.push("/login");
        } else {
            const data = await res.json();
            setError(data.message || "Kayıt başarısız oldu");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl shadow-lg shadow-secondary/30 mb-4"
                    >
                        <FlaskConical className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-foreground">KimyaLAB</h1>
                    <p className="text-foreground/50 mt-1 font-medium">Hemen aramıza katıl</p>
                </div>

                {/* Card */}
                <div className="glass rounded-3xl p-8 shadow-2xl shadow-secondary/5">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-5 h-5 text-secondary" />
                        <h2 className="text-xl font-bold text-foreground">Kayıt Ol</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-secondary transition-colors" />
                            <input
                                type="text"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-border-theme rounded-2xl focus:outline-none focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-foreground placeholder-foreground/30"
                                placeholder="Ad Soyad"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-secondary transition-colors" />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-border-theme rounded-2xl focus:outline-none focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-foreground placeholder-foreground/30"
                                placeholder="Email adresi"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-secondary transition-colors" />
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-border-theme rounded-2xl focus:outline-none focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-foreground placeholder-foreground/30"
                                placeholder="Şifre"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm text-center font-medium bg-red-500/10 py-2 px-4 rounded-xl"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Kayıt Ol
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border-theme text-center">
                        <p className="text-sm text-foreground/50 font-medium">
                            Zaten hesabın var mı?{" "}
                            <Link href="/login" className="font-bold text-secondary hover:text-secondary/80 transition-colors">
                                Giriş Yap
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
