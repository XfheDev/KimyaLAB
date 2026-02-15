import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// Clean up poisoned environment variables that some CI/CD tools might set
if (process.env.DATABASE_URL === "undefined") {
    console.error("🧹 Removing poisoned DATABASE_URL 'undefined'");
    delete process.env.DATABASE_URL;
}
if (process.env.TURSO_AUTH_TOKEN === "undefined") {
    delete process.env.TURSO_AUTH_TOKEN;
}

const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
        console.error("❌ ERROR: DATABASE_URL is missing!");
        // Fallback to avoid crash during build/init, but it will fail on real queries
        return new PrismaClient();
    }

    const normalizedUrl = url.startsWith("https://") ? url.replace("https://", "libsql://") : url;

    console.error(`🚀 InitialIZING Prisma - ${normalizedUrl.split(':')[0]}://... [Len: ${normalizedUrl.length}]`);

    const libsql = createClient({
        url: normalizedUrl,
        authToken: authToken,
    });

    const adapter = new PrismaLibSql(libsql as any);
    return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

// Singleton pattern for BOTH dev and prod to ensure stability in serverless
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

globalForPrisma.prisma = prisma;
