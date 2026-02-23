"use client";

import { motion } from "framer-motion";

export default function SkeletonCard() {
    return (
        <div className="glass-morphism h-[380px] rounded-[3rem] p-10 border border-border-theme/40 relative overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 translate-x-[-100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                    <div className="w-16 h-16 bg-foreground/10 rounded-2xl" />
                    <div className="space-y-2">
                        <div className="h-2 w-16 bg-foreground/10 rounded-full ml-auto" />
                        <div className="h-4 w-12 bg-foreground/10 rounded-full" />
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="h-8 w-[80%] bg-foreground/10 rounded-xl" />
                    <div className="h-8 w-[40%] bg-foreground/10 rounded-xl" />
                </div>

                <div className="flex gap-2 mb-auto">
                    <div className="h-6 w-12 bg-foreground/10 rounded-lg" />
                    <div className="h-6 w-16 bg-foreground/10 rounded-lg" />
                </div>

                <div className="pt-8 border-t border-border-theme/30 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="h-2 w-10 bg-foreground/10 rounded-full" />
                        <div className="h-5 w-20 bg-foreground/10 rounded-full" />
                    </div>
                    <div className="w-14 h-14 rounded-full bg-foreground/10" />
                </div>
            </div>
        </div>
    );
}
