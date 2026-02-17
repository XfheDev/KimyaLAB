/**
 * ⚠️ CRITICAL FIX: JavaScript 'import' statements are HOISTED.
 * Even if we write env var assignments above them, imports execute first.
 * 
 * Solution: Set DATABASE_URL and then use require() for Prisma.
 * require() is NOT hoisted and executes in order.
 */

// 1. IMMEDIATELY stash the real URL and mask DATABASE_URL
const _realDbUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
process.env.DATABASE_URL = "file:./dev.db";

// 2. NOW load Prisma (after masking)
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");

const prismaClientSingleton = () => {
    const url = _realDbUrl || "file:./dev.db";
    const authToken = process.env.TURSO_AUTH_TOKEN;

    console.error(`🏗️ [PRISMA] URL: ${url.substring(0, 20)}... | Token: ${!!authToken}`);

    const adapterUrl = url.startsWith("https://")
        ? url.replace("https://", "libsql://")
        : url;

    const client = createClient({
        url: adapterUrl,
        authToken: authToken,
    });

    const adapter = new PrismaLibSql(client);
    return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
    prisma: any;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
