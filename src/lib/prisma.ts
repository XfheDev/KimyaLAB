// ⚠️ CRITICAL: Set DATABASE_URL BEFORE importing Prisma.
// The Prisma WASM query compiler reads process.env.DATABASE_URL during module initialization.
// Without this, it resolves to 'undefined' and throws URL_INVALID.
// We stash the real URL first, then mask it.
const _realDbUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
process.env.DATABASE_URL = "file:./dev.db";

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
    const url = _realDbUrl || "file:./dev.db";
    const authToken = process.env.TURSO_AUTH_TOKEN;

    console.error(`🏗️ [PRISMA] URL: ${url.substring(0, 20)}... | Token: ${!!authToken}`);

    // Normalize URL for adapter
    const adapterUrl = url.startsWith("https://")
        ? url.replace("https://", "libsql://")
        : url;

    const client = createClient({
        url: adapterUrl,
        authToken: authToken,
    });

    const adapter = new PrismaLibSql(client as any);
    return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma as any;
