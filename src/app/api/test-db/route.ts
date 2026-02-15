import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    console.error("🔍 DB DIAGNOSTIC START");
    try {
        // Log environment keys (no values for security)
        const keys = Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("TURSO") || k.includes("URL"));
        console.error("🔍 DB DIAGNOSTIC - Env Keys:", keys);

        // Test simple query
        const count = await prisma.user.count();
        console.error("🔍 DB DIAGNOSTIC SUCCESS - User count:", count);

        // Find which key is actually set in env
        const activeKey = ['DATABASE_URL', 'TURSO_DATABASE_URL', 'TURSO_DB_URL'].find(k => process.env[k] && process.env[k] !== "undefined");

        return NextResponse.json({
            status: "success",
            count,
            activeKey,
            nodeVersion: process.version,
        });
    } catch (error: any) {
        console.error("🔍 DB DIAGNOSTIC FAILED:", error);
        return NextResponse.json({
            status: "error",
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack,
            envKeysFound: Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("TURSO"))
        }, { status: 500 });
    }
}
