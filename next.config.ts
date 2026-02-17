import type { NextConfig } from "next";

// ⚠️ CRITICAL: Mask DATABASE_URL before ANY server code loads.
// next.config.ts is the FIRST module Next.js evaluates.
// Prisma 7's WASM query compiler reads process.env.DATABASE_URL during module init
// and crashes with URL_INVALID if it sees a libsql:// URL (or undefined).
// The actual Turso connection is handled by the LibSQL adapter in src/lib/prisma.ts.
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("libsql://")) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
