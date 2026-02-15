import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

/**
 * Prisma Client Initialization
 * Using Prisma 7 + LibSQL Adapter for Turso
 */

const prismaClientSingleton = () => {
    // 1. Get credentials
    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./dev.db";
    const authToken = process.env.TURSO_AUTH_TOKEN;

    console.error(`🏗️ [PRISMA INIT] Starting...`);

    // 2. Prepare adapter URL (must be libsql:// or https://)
    // If it's a file path, we might be in local dev without Turso
    const adapterUrl = url.startsWith("file:") ? "file:./dev.db" : (
        url.startsWith("https://") ? url.replace("https://", "libsql://") : url
    );

    console.error(`🏗️ [PRISMA INIT] Adapter URL: ${adapterUrl.substring(0, 15)}... | Token: ${!!authToken}`);

    // 3. Create LibSQL Client
    const client = createClient({
        url: adapterUrl,
        authToken: authToken,
    });

    // 4. Create Adapter
    const adapter = new PrismaLibSql(client as any);

    // 5. Instantiate Prisma Client
    // With an adapter, we SHOULD NOT need to pass datasourceUrl.
    // We rely on the adapter to handle communication.
    return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = (prisma as any);
