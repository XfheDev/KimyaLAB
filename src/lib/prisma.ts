import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

/**
 * 🔒 ROBUST STASH & MASK STRATEGY
 * 
 * Problem: 
 * 1. Prisma Engine needs 'file:' URL (to match schema provider="sqlite").
 * 2. Adapter needs 'libsql:' URL (to connect to Turso).
 * 3. Vercel/Lambda reuses containers, so modifying process.env persists.
 * 
 * Solution:
 * 1. Check a stash variable first.
 * 2. If valid URL found in DATABASE_URL, stash it.
 * 3. Mask DATABASE_URL with dummy file for the engine.
 * 4. Pass real stashed URL to Adapter.
 */

const setupEnvironment = () => {
    // 1. Try to recover from stash first
    let realUrl = process.env._PRISMA_STASHED_URL || process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_URL || process.env.DATABASE_URL;

    // 2. Identify if we have a valid remote URL
    const isRemote = realUrl?.startsWith("libsql://") || realUrl?.startsWith("https://");

    if (isRemote && realUrl) {
        // Stash it for future warm-starts
        process.env._PRISMA_STASHED_URL = realUrl;

        // 3. Mask the public variable for Prisma Engine validation
        if (process.env.DATABASE_URL !== "file:./dev.db") {
            console.error(`🏗️ [PRISMA] Stashing real URL and masking DATABASE_URL.`);
            process.env.DATABASE_URL = "file:./dev.db";
        }
    } else {
        console.error(`🏗️ [PRISMA] No remote URL found or already masked without stash. URL: ${realUrl?.substring(0, 10)}...`);
    }

    return {
        url: realUrl,
        token: process.env.TURSO_AUTH_TOKEN
    };
};

const prismaClientSingleton = () => {
    const { url, token } = setupEnvironment();

    // If we have a remote URL, use the adapter
    if (url && (url.startsWith("libsql://") || url.startsWith("https://"))) {
        const adapterUrl = url.startsWith("https://") ? url.replace("https://", "libsql://") : url;

        console.error(`🏗️ [PRISMA] Connecting Adapter to: ${adapterUrl.substring(0, 20)}...`);

        const client = createClient({
            url: adapterUrl,
            authToken: token,
        });

        const adapter = new PrismaLibSql(client as any);

        // 4. Instantiate Prisma Client
        // We pass the adapter. The engine will use the masked process.env.DATABASE_URL
        // because we restored 'url = env("DATABASE_URL")' in schema.prisma.
        return new PrismaClient({ adapter });
    }

    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = (prisma as any);
