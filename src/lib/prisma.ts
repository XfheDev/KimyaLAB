import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// Singleton pattern to ensure we don't create multiple clients in serverless
const prismaClientSingleton = () => {
    // 1. Capture environment variables
    const rawUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
    const rawToken = process.env.TURSO_AUTH_TOKEN;

    // 2. Handle "undefined" string poisoning and missing values
    const connectionUrl = (rawUrl && rawUrl !== "undefined") ? rawUrl : "file:./dev.db";
    const connectionToken = (rawToken && rawToken !== "undefined") ? rawToken : undefined;

    // 3. Normalize protocol for LibSQL (ensure libsql:// for adapter compatibility)
    const normalizedUrl = connectionUrl.startsWith("https://")
        ? connectionUrl.replace("https://", "libsql://")
        : connectionUrl;

    console.error(`[Prisma Init] Protocol: ${normalizedUrl.split(':')[0]}, URL: ${normalizedUrl.substring(0, 15)}...`);

    // 4. Create the underlying LibSQL client
    const client = createClient({
        url: normalizedUrl,
        authToken: connectionToken,
    });

    // 5. Create the Prisma adapter for LibSQL
    const adapter = new PrismaLibSql(client as any);

    /**
     * 6. Initialize Prisma Client.
     * CRITICAL: We pass datasourceUrl explicitly even with the adapter.
     * This fixes the "URL_INVALID: The URL 'undefined'" error in Prisma 7.
     */
    return new PrismaClient({
        adapter,
        // @ts-ignore - Required for internal metadata state in Prisma 7+
        datasourceUrl: normalizedUrl
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
