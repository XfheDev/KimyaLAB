import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

/**
 * Hyper-defensive Prisma Client Initialization.
 * Solves "URL_INVALID: The URL 'undefined'" by ensuring the environment
 * is totally clean before Prisma's engine touches it.
 */

const getValidDbUrl = () => {
    const keys = ['TURSO_DATABASE_URL', 'TURSO_DB_URL', 'DATABASE_URL'];
    for (const key of keys) {
        const val = process.env[key];
        if (val && val !== "undefined" && val.trim().length > 0) {
            // Normalize https to libsql for adapter
            return val.startsWith("https://") ? val.replace("https://", "libsql://") : val;
        }
    }
    return "file:./dev.db"; // Safe local fallback for build/init
};

const prismaClientSingleton = () => {
    const url = getValidDbUrl();
    const token = process.env.TURSO_AUTH_TOKEN || undefined;

    console.error(`🏗️ [PRISMA INIT] URL: ${url.substring(0, 20)}... | Token: ${!!token}`);

    // CRITICAL: We override process.env.DATABASE_URL because Prisma's 
    // hidden engine looks at it even when an adapter is provided.
    process.env.DATABASE_URL = url;

    const client = createClient({
        url: url,
        authToken: token,
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
