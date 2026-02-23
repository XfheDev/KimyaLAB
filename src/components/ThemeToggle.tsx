"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return (
        <div className="w-12 h-12 bg-foreground/5 rounded-2xl border border-border-theme animate-pulse" />
    );

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-14 h-14 bg-foreground/5 hover:bg-foreground/10 rounded-2xl border border-border-theme/50 flex items-center justify-center group overflow-hidden transition-all active:scale-90"
            title={isDark ? "Aydınlık Mod" : "Karanlık Mod"}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ y: 20, rotate: 45, opacity: 0 }}
                        animate={{ y: 0, rotate: 0, opacity: 1 }}
                        exit={{ y: -20, rotate: -45, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                    >
                        <Moon className="h-6 w-6 text-primary fill-primary/20" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ y: 20, rotate: -45, opacity: 0 }}
                        animate={{ y: 0, rotate: 0, opacity: 1 }}
                        exit={{ y: -20, rotate: 45, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                    >
                        <Sun className="h-6 w-6 text-orange-500 fill-orange-500/20" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle glow behind the icon */}
            <div className={`absolute inset-0 blur-xl opacity-20 transition-colors duration-500 ${isDark ? 'bg-primary' : 'bg-orange-500'}`} />
        </button>
    );
}
