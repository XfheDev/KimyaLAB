"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (session?.user?.name) {
            setFormData((prev) => ({ ...prev, name: session.user.name || "" }));
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Yeni şifreler eşleşmiyor." });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    currentPassword: formData.currentPassword || undefined,
                    newPassword: formData.newPassword || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Bir hata oluştu.");
            }

            setMessage({ type: "success", text: "Profil başarıyla güncellendi." });

            // Update session if name changed
            if (formData.name !== session?.user?.name) {
                await update({ name: formData.name });
            }

            // Clear password fields
            setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));

        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto space-y-8"
            >
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-foreground">Hesap Ayarları</h2>
                    <p className="mt-2 text-sm text-foreground/60">Profil bilgilerinizi ve şifrenizi güncelleyin.</p>
                </div>

                <div className="bg-white dark:bg-card p-8 rounded-3xl shadow-xl border border-border-theme">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className={`p-4 rounded-xl flex items-center gap-3 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </motion.div>
                        )}

                        {/* Profile Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border-theme pb-2">
                                <User className="h-5 w-5 text-primary" /> Profil Bilgileri
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-foreground/70 mb-1">Kullanıcı Adı</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-border-theme rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="İsminiz"
                                />
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="space-y-4 pt-4">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border-theme pb-2">
                                <Lock className="h-5 w-5 text-primary" /> Güvenlik
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-foreground/70 mb-1">Mevcut Şifre (Sadece şifre değiştirecekseniz)</label>
                                <input
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-border-theme rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground/70 mb-1">Yeni Şifre</label>
                                    <input
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-background border border-border-theme rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Yeni şifreniz"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground/70 mb-1">Yeni Şifre (Tekrar)</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-background border border-border-theme rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Yeni şifreniz (tekrar)"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                Değişiklikleri Kaydet
                            </button>
                        </div>

                    </form>
                </div>
            </motion.div>
        </div>
    );
}
