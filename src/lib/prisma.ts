import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

/**
 * Prisma 6 + Turso/LibSQL Fix
 * 
 * In Prisma 6, PrismaLibSQL is a factory. 
 * We must pass the factory instance directly to PrismaClient as 'adapter'.
 * PrismaClient will internaly call adapter.connect() during initialization.
 */

const prismaClientSingleton = () => {
    // Primary URL should be the Turso one
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
        console.error("🏗️ [PRISMA] ERROR: TURSO_DATABASE_URL is not set!");
    }

    // Initialize the adapter factory
    const adapter = new PrismaLibSQL({
        url: url || "file:./dev.db",
        authToken: authToken,
    });

    // Pass the factory as the adapter
    return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma as any;
