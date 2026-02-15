import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const url = process.env.DATABASE_URL || "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!authToken) {
    console.error("⚠️ TURSO_AUTH_TOKEN is missing in environment variables!");
}

const libsql = createClient({
    url,
    authToken
});

const adapter = new PrismaLibSql(libsql as any);

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: ["query"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
