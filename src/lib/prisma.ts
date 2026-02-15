import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Determine URL based on environment
const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

let prismaInstance: PrismaClient;

try {
    if (process.env.NODE_ENV === "production") {
        if (!url || !authToken) {
            console.error("❌ CRITICAL ERROR: DATABASE_URL or TURSO_AUTH_TOKEN is missing in production!");
            // We initiate a dummy client or throw to prevent silent failures, 
            // but throwing here might crash the build if not handled.
            // However, for runtime, we need these.
        }

        const libsql = createClient({
            url: url || "file:./dev.db", // Fallback only to prevent immediate crash, though it won't work for real queries if url is missing
            authToken
        });

        const adapter = new PrismaLibSql(libsql as any);
        prismaInstance = new PrismaClient({ adapter });
    } else {
        // Development
        if (!globalForPrisma.prisma) {
            const devUrl = url || "file:./dev.db";
            const libsql = createClient({
                url: devUrl,
                authToken
            });
            const adapter = new PrismaLibSql(libsql as any);
            globalForPrisma.prisma = new PrismaClient({ adapter });
        }
        prismaInstance = globalForPrisma.prisma;
    }
} catch (error) {
    console.error("❌ Failed to initialize Prisma Client:", error);
    // Fallback to avoid "cannot read property of undefined" elsewhere, though app is effectively broken
    prismaInstance = new PrismaClient();
}

export const prisma = prismaInstance;
