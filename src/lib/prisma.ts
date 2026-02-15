import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// Global singleton to prevent multiple instances in development and serverless
const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    // Use a fallback for build time/initialization, but real queries will fail if URL is missing
    const finalUrl = (url && url !== "undefined") ? url : "file:./dev.db";

    // Normalize https to libsql for the adapter
    const normalizedUrl = finalUrl.startsWith("https://")
        ? finalUrl.replace("https://", "libsql://")
        : finalUrl;

    console.error(`🏗️ Prisma Init - Protocol: ${normalizedUrl.split(':')[0]}, URL Length: ${normalizedUrl.length}`);

    // Create LibSQL client
    const client = createClient({
        url: normalizedUrl,
        authToken: authToken,
    });

    // Create Prisma adapter for LibSQL
    const adapter = new PrismaLibSql(client as any);

    // Initialize Prisma Client
    // Prisma 7 uses 'datasourceUrl' (singular) to override the connection string
    // We use 'as any' to avoid TypeScript 'never' error in some configurations
    return new PrismaClient({
        adapter,
        datasourceUrl: normalizedUrl
    } as any);
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
