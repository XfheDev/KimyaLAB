import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
    // 1. Capture the REAL connection string from environment
    // We check multiple keys to be comprehensive
    const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_URL || process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    console.error(`🏗️ [PRISMA] Real URL found: ${!!tursoUrl} | Token found: ${!!authToken}`);

    // If we have a URL, we want to use the Adapter (LibSQL)
    if (tursoUrl) {
        // 2. Normalize to libsql:// for the adapter
        const adapterUrl = tursoUrl.startsWith("https://")
            ? tursoUrl.replace("https://", "libsql://")
            : tursoUrl;

        // 3. CRITICAL HACK: Overwrite DATABASE_URL with a dummy file path
        // This satisfies Prisma's internal engine which expects a 'file:' URL for 'provider = "sqlite"'
        // The engine validation runs against process.env.DATABASE_URL even if an adapter is provided!
        process.env.DATABASE_URL = "file:./dev.db";

        console.error(`🏗️ [PRISMA] Masking DATABASE_URL as 'file:./dev.db' for engine validation.`);

        const client = createClient({
            url: adapterUrl,
            authToken: authToken,
        });

        const adapter = new PrismaLibSql(client as any);

        return new PrismaClient({ adapter });
    }

    // Fallback for purely local dev if no env vars are set
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = (prisma as any);
