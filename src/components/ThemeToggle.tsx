"use client";

import * as React from "react";
import { Moon, Sun, Stars, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
    { id: "light", icon: Sun, color: "text-amber-500" },
    { id: "dark", icon: Moon, color: "text-indigo-400" },
];

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="p-2 h-10 w-10" />;

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const currentTheme = themes.find(t => t.id === theme) || themes[0];
    const Icon = currentTheme.icon;

    return (
        <button
            onClick={toggleTheme}
            className="group relative p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all border border-gray-200/50 dark:border-slate-700/50 shadow-sm"
            title={`${currentTheme.id.charAt(0).toUpperCase() + currentTheme.id.slice(1)} Tema`}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    initial={{ y: 5, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -5, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                >
                    <Icon className={`h-5 w-5 ${currentTheme.color}`} />
                </motion.div>
            </AnimatePresence>
            <span className="sr-only">Temayı Değiştir</span>
        </button>
    );
}
