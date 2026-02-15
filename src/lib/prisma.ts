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
            console.log("DEBUG - env keys:", Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("TURSO")));
            // We initiate a dummy client or throw to prevent silent failures, 
            // but throwing here might crash the build if not handled.
            // However, for runtime, we need these.
        } else {
            console.log("✅ Database URL length:", url.length);
            console.log("✅ Database URL protocol:", url.split(":")[0]);
            console.log("✅ Database URL starts with:", url.substring(0, 10));
            // console.log("✅ Auth Token status: Present"); // This log is replaced by more detailed ones
        }

        // Ensure we handle the string "undefined" which can happen in some environments
        const finalUrl = (url && url !== "undefined") ? url : "file:./dev.db";
        const finalToken = (authToken && authToken !== "undefined") ? authToken : undefined;

        console.log("🚀 Initializing LibSQL with URL:", finalUrl.substring(0, 15) + "...");

        const libsql = createClient({
            url: finalUrl, // Fallback only to prevent immediate crash, though it won't work for real queries if url is missing
            authToken: finalToken
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
