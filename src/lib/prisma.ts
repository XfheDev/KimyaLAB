import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

/**
 * 🚀 Final Boss Fix for Turso + Prisma 7 on Vercel
 * 
 * 1. The 'schema.prisma' now has a hardcoded 'url = "file:./dev.db"'.
 *    This keeps Prisma's internal engine happy and stops "URL_INVALID" errors.
 * 2. This file (prisma.ts) uses the 'PrismaLibSql' adapter to redirect
 *    all actual traffic to Turso.
 */

const prismaClientSingleton = () => {
    // Capture Turso credentials
    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./dev.db";
    const token = process.env.TURSO_AUTH_TOKEN || undefined;

    // If we're using a real Turso URL, use the adapter
    if (url.startsWith("https://") || url.startsWith("libsql://")) {
        const normalizedUrl = url.startsWith("https://") ? url.replace("https://", "libsql://") : url;

        console.error(`🏗️ [PRISMA ADAPTER] Connecting to ${normalizedUrl.substring(0, 20)}...`);

        const client = createClient({
            url: normalizedUrl,
            authToken: token,
        });

        const adapter = new PrismaLibSql(client as any);
        return new PrismaClient({ adapter });
    }

    // Fallback for local development or if no Turso URL is found
    console.error("🏗️ [PRISMA LOCAL] No Turso URL found, using local SQLite.");
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = (prisma as any);
