import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

/**
 * 🛠️ THE DUMMY URL STRATEGY (Prisma 7 + Turso)
 * 
 * Problem: Prisma's internal engine tries to validate DATABASE_URL as a SQLite file
 * if it sees 'provider = "sqlite"' in the schema. When it sees an https/libsql URL,
 * or fails to find a variable, it throws URL_INVALID: 'undefined'.
 * 
 * Solution: We set a dummy file: URL to satisfy the engine, but use the real 
 * Turso URL in the adapter. The adapter handles all the actual database traffic.
 */

const getTursoUrl = () => {
    const keys = ['TURSO_DATABASE_URL', 'TURSO_DB_URL', 'DATABASE_URL'];
    for (const key of keys) {
        const val = process.env[key];
        if (val && val !== "undefined" && val.trim().length > 0) {
            return val;
        }
    }
    return undefined;
};

// 1. Capture the real Turso URL
const realUrl = getTursoUrl();
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

// 2. FORCE a valid SQLite URL in the environment to stop Prisma from complaining
// This doesn't affect the adapter used below.
process.env.DATABASE_URL = "file:./dev.db";

console.error(`🏗️ [PRISMA] Internal URL masked as file:./dev.db | Real URL exists: ${!!realUrl}`);

const prismaClientSingleton = () => {
    if (!realUrl) {
        console.error("❌ CRITICAL: No Turso URL found. Falling back to local SQLite.");
        return new PrismaClient();
    }

    // Normalize protocol for the adapter
    const adapterUrl = realUrl.startsWith("https://")
        ? realUrl.replace("https://", "libsql://")
        : realUrl;

    const client = createClient({
        url: adapterUrl,
        authToken: authToken,
    });

    const adapter = new PrismaLibSql(client as any);

    return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = (prisma as any);
