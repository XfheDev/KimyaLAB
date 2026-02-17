import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

/**
 * Prisma Client with Turso/LibSQL adapter.
 * 
 * DATABASE_URL is masked to "file:./dev.db" in next.config.ts
 * so the Prisma WASM engine doesn't crash. The actual connection
 * goes through the LibSQL adapter using TURSO_DATABASE_URL.
 */

const prismaClientSingleton = () => {
    const url = process.env.TURSO_DATABASE_URL || "file:./dev.db";
    const authToken = process.env.TURSO_AUTH_TOKEN;

    console.error(`🏗️ [PRISMA] URL: ${url.substring(0, 20)}... | Token: ${!!authToken}`);

    const adapterUrl = url.startsWith("https://")
        ? url.replace("https://", "libsql://")
        : url;

    const client = createClient({
        url: adapterUrl,
        authToken: authToken,
    });

    const adapter = new PrismaLibSql(client as any);
    return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma as any;
