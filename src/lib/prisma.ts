import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

/**
 * Prisma 6 + Turso/LibSQL
 * 
 * - Schema has url = env("DATABASE_URL") → engine reads "file:./dev.db" from Vercel env
 * - Adapter uses TURSO_DATABASE_URL for actual Turso connection
 * - driverAdapters preview feature enabled in schema
 */

const prismaClientSingleton = () => {
    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./dev.db";
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
    return new PrismaClient({ adapter } as any);
};

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma as any;
