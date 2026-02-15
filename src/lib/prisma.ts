import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// Singleton pattern
const prismaClientSingleton = () => {
    // 1. Get env vars with fallbacks
    const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "file:./dev.db";
    const authToken = process.env.TURSO_AUTH_TOKEN;

    // 2. Extra safety against "undefined" string
    const finalUrl = url === "undefined" ? "file:./dev.db" : url;

    console.error(`🏗️ Prisma Construction - URL: ${finalUrl.substring(0, 15)}...`);

    // 3. Create LibSQL client
    const client = createClient({
        url: finalUrl,
        authToken: authToken,
    });

    // 4. Create Adapter
    const adapter = new PrismaLibSql(client as any);

    // 5. Build options
    const options: any = { adapter };

    // Explicitly pass to datasources to fix the 'undefined' error in Prisma 7
    options.datasources = {
        db: {
            url: finalUrl
        }
    };

    return new PrismaClient(options);
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
