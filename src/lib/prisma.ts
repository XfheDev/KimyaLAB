import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Determine URL based on environment (Try both common Turso names)
const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

let prismaInstance: PrismaClient;

try {
    if (process.env.NODE_ENV === "production") {
        console.log("🛠️ Prisma Prod Init - Checking Env Vars...");

        const envKeys = Object.keys(process.env);
        console.log("DEBUG - Found DB-related keys:", envKeys.filter(k => k.includes("DATABASE") || k.includes("TURSO") || k.includes("URL")));

        if (!url || url === "undefined") {
            console.error("❌ CRITICAL ERROR: DATABASE_URL is missing or 'undefined' in production!");
        }
        if (!authToken || authToken === "undefined") {
            console.error("❌ CRITICAL ERROR: TURSO_AUTH_TOKEN is missing or 'undefined' in production!");
        }

        // Ensure we handle the string "undefined" which can happen in some environments
        const finalUrl = (url && url !== "undefined") ? url : "file:./dev.db";
        const finalToken = (authToken && authToken !== "undefined") ? authToken : undefined;

        console.log("🚀 Connection Attempt:", {
            protocol: finalUrl.includes(":") ? finalUrl.split(":")[0] : "none",
            urlStart: finalUrl.substring(0, 10) + "...",
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
