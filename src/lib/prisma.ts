import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
    // Try to find the DB URL from any possible key
    const keys = ['DATABASE_URL', 'TURSO_DATABASE_URL', 'TURSO_DB_URL', 'NEXT_PUBLIC_DATABASE_URL'];
    let rawUrl: string | undefined;
    let foundKey: string | undefined;

    for (const key of keys) {
        const val = process.env[key];
        if (val && val !== "undefined" && val.trim() !== "") {
            rawUrl = val;
            foundKey = key;
            break;
        }
    }

    const authToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_DB_AUTH_TOKEN;

    console.error(`🔍 DB SEARCH: Found ${foundKey ? foundKey : 'NONE'} [Keys checked: ${keys.join(', ')}]`);

    if (!rawUrl) {
        console.error("❌ CRITICAL: No valid Database URL found in environment variables!");
        return new PrismaClient(); // This will fail later but avoids crash here
    }

    // Normalize for LibSQL
    const normalizedUrl = rawUrl.startsWith("https://")
        ? rawUrl.replace("https://", "libsql://")
        : rawUrl;

    console.error(`🏗️ Prisma Init - Key: ${foundKey}, URL: ${normalizedUrl.substring(0, 15)}... , Token: ${!!authToken}`);

    try {
        const client = createClient({
            url: normalizedUrl,
            authToken: authToken,
        });

        const adapter = new PrismaLibSql(client as any);
        return new PrismaClient({ adapter });
    } catch (e) {
        console.error("❌ FAILED to create LibSQL client:", e);
        return new PrismaClient();
    }
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = (prisma as any);
