"use client";

import { useState } from "react";

export default function ResetUserPage() {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        setLoading(true);
        setStatus("İşlem başlıyor...");
        try {
            const res = await fetch("/api/reset-user-script", { method: "POST" });
            const data = await res.json();
            setStatus(JSON.stringify(data, null, 2));
        } catch (e) {
            setStatus("Hata: " + e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Acil Kullanıcı Oluşturma Paneli</h1>
            <p className="mb-4 text-red-500">
                Bu araç veritabanında 'test@example.com' kullanıcısını '123456' şifresiyle oluşturur veya şifresini sıfırlar.
            </p>
            <button
                onClick={handleReset}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "İşleniyor..." : "Kullanıcıyı Oluştur / Sıfırla"}
            </button>
            <pre className="mt-4 bg-gray-100 p-4 rounded border whitespace-pre-wrap">
                {status}
            </pre>
        </div>
    );
}
