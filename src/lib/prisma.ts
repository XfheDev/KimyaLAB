import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || url === "undefined") {
        console.error("❌ DATABASE_URL is missing or undefined");
        return new PrismaClient();
    }

    // Normalizing URL for LibSQL
    const normalizedUrl = url.replace("https://", "libsql://");

    console.error(`🏗️ Prisma Init - URL: ${normalizedUrl.substring(0, 20)}...`);

    const client = createClient({
        url: normalizedUrl,
        authToken: authToken,
    });

    const adapter = new PrismaLibSql(client as any);

    // In Prisma 7, when using an adapter, we purely rely on the adapter for the connection.
    // The internal engine still reads DATABASE_URL from the environment.
    // We ensure it's set to something valid if it's not already.
    if (process.env.DATABASE_URL !== normalizedUrl) {
        process.env.DATABASE_URL = normalizedUrl;
    }

    return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = (prisma as any);
