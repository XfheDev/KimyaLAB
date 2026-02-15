import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
    // 1. Get the REAL connection info
    const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_URL || process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    console.error(`🏗️ [PRISMA] Real URL available: ${!!tursoUrl}`);

    // If we have a Turso URL, use the Adapter
    if (tursoUrl) {
        // Normalize
        const adapterUrl = tursoUrl.startsWith("https://")
            ? tursoUrl.replace("https://", "libsql://")
            : tursoUrl;

        const client = createClient({
            url: adapterUrl,
            authToken: authToken,
        });

        const adapter = new PrismaLibSql(client as any);

        /**
         * 2. CONSTRUCTOR INJECTION
         * We explicitly pass 'datasourceUrl' as a local file path.
         * This satisfies the internal engine that expects a "file:" url for provider="sqlite".
         * The 'adapter' takes precedence for actual queries.
         */
        return new PrismaClient({
            adapter,
            datasourceUrl: "file:./dev.db"
        } as any);
    }

    // Fallback for local
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = (prisma as any);
