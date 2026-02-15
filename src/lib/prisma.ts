import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Determine URL based on environment (Try ALL common Turso names)
const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

let prismaInstance: PrismaClient;

try {
    if (process.env.NODE_ENV === "production") {
        console.error("🛠️ Prisma Prod Init - Checking Env...");

        const envKeys = Object.keys(process.env);
        const dbKeys = envKeys.filter(k => k.includes("DATABASE") || k.includes("TURSO") || k.includes("URL"));
        console.error("DEBUG - Found DB-related keys:", dbKeys);

        // Debug specific values (safely)
        console.error("DEBUG - DATABASE_URL exists:", !!process.env.DATABASE_URL);
        console.error("DEBUG - TURSO_AUTH_TOKEN exists:", !!process.env.TURSO_AUTH_TOKEN);

        if (process.env.DATABASE_URL === "undefined") console.error("⚠️ WARNING: DATABASE_URL is literally the string 'undefined'");

        if (!url || url === "undefined") {
            console.error("❌ CRITICAL ERROR: Database URL is missing in production!");
        }
        // The original check for authToken was removed as per the diff.

        // Ensure we handle the string "undefined" which can happen in some environments
        const finalUrl = (url && url !== "undefined") ? url : "file:./dev.db";
        const finalToken = (authToken && authToken !== "undefined") ? authToken : undefined;

        console.error("🚀 Connection Details:", {
            protocol: finalUrl.includes(":") ? finalUrl.split(":")[0] : "none",
            urlLength: finalUrl.length,
            hasToken: !!finalToken
        });

        const libsql = createClient({
            url: finalUrl,
            authToken: finalToken
        });

        const adapter = new PrismaLibSql(libsql as any);
        prismaInstance = new PrismaClient({ adapter });
    } else {
        // Development configuration
        if (!globalForPrisma.prisma) {
            const devUrl = url || "file:./dev.db";
            const libsql = createClient({
                url: devUrl,
                authToken
            });
            const adapter = new PrismaLibSql(libsql as any);
            globalForPrisma.prisma = new PrismaClient({
                adapter,
                log: ['query', 'error', 'warn']
            });
        }
        prismaInstance = globalForPrisma.prisma;
    }
} catch (error) {
    console.error("❌ CRITICAL: Failed to initialize Prisma Client:", error);
    prismaInstance = new PrismaClient();
}

export const prisma = prismaInstance;
