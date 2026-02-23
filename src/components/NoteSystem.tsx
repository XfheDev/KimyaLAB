"use client";

import { useState, useEffect } from "react";
import { StickyNote, Plus, Trash2, Send, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/AudioProvider";
import { cn } from "@/lib/utils";

interface Note {
    id: string;
    content: string;
    createdAt: string;
}

export default function NoteSystem() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { playSFX } = useAudio();

    useEffect(() => {
        fetch("/api/notes")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setNotes(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim() || submitting) return;

        setSubmitting(true);
        playSFX('click');
        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newNote }),
            });
            if (res.ok) {
                const data = await res.json();
                setNotes(prev => [data, ...prev]);
                setNewNote("");
                playSFX('success');
            }
        } catch (error) {
            console.error("Failed to add note", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        playSFX('error');
        try {
            const res = await fetch("/api/notes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setNotes(prev => prev.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete note", error);
        }
    };

    return (
        <div className="glass-morphism rounded-[3rem] p-10 border border-primary/20 shadow-2xl relative overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-universal" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl shadow-primary/20">
                        <StickyNote className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-foreground">Atomik Notlar</h3>
                        <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mt-1">Deneysel Gözlemlerin</p>
                    </div>
                </div>
                <div className="px-5 py-2 bg-primary/10 rounded-xl border border-primary/20">
                    <span className="text-sm font-black text-primary">{notes.length}</span>
                </div>
            </div>

            <form onSubmit={handleAddNote} className="relative mb-8 z-10">
                <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Yeni bir gözlem kaydet..."
                    className="w-full pl-8 pr-20 py-6 bg-foreground/5 border-2 border-border-theme/40 rounded-3xl focus:outline-none focus:border-primary focus:ring-[15px] focus:ring-primary/5 transition-universal font-bold text-lg text-foreground placeholder-foreground/20"
                />
                <button
                    type="submit"
                    disabled={submitting || !newNote.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-universal disabled:opacity-50 disabled:scale-100 shadow-xl"
                >
                    <Send className="h-6 w-6" />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {notes.map((note, idx) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/5 border border-border-theme/30 p-6 rounded-[2rem] group/note hover:border-primary/40 hover:bg-white/10 transition-universal relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover/note:opacity-100 transition-opacity" />
                            <div className="flex items-start justify-between gap-4 relative z-10">
                                <div className="flex-1">
                                    <p className="text-lg font-bold text-foreground/80 leading-relaxed mb-4">{note.content}</p>
                                    <div className="flex items-center gap-2 opacity-30 text-[10px] font-black uppercase tracking-widest">
                                        <Clock className="h-3 w-3" />
                                        {new Date(note.createdAt).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="p-3 text-foreground/20 hover:text-danger hover:bg-danger/10 rounded-xl transition-universal opacity-0 group-hover/note:opacity-100"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {!loading && notes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                        <Sparkles className="h-12 w-12 mb-4" />
                        <p className="text-sm font-black uppercase tracking-[0.4em]">Henüz Gözlem Yok</p>
                    </div>
                )}
            </div>
        </div>
    );
}
