import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
    return (
        <div className={cn("relative shrink-0 flex items-center justify-center", className, "group")}>
            {/* Main Atom/Molecule Body */}
            <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                animate={{
                    rotate: 360
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {/* Orbits */}
                <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-20" transform="rotate(0 50 50)" />
                <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-20" transform="rotate(60 50 50)" />
                <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-20" transform="rotate(120 50 50)" />

                {/* Nucleus */}
                <circle cx="50" cy="50" r="12" className="fill-primary" />
                <circle cx="50" cy="50" r="8" className="fill-secondary animate-pulse" />

                {/* Electrons */}
                <motion.circle
                    r="4"
                    className="fill-accent"
                    animate={{
                        offsetDistance: ["0%", "100%"]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        offsetPath: "path('M 5,50 a 45,18 0 1,0 90,0 a 45,18 0 1,0 -90,0')",
                    }}
                />
            </motion.svg>

            {/* Visual Echo / Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 -z-10 group-hover:bg-primary/30 transition-all duration-700" />
        </div>
    );
}
