import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const diag: any = {
        timestamp: new Date().toISOString(),
        env: {}
    };

    // Safely collect environment info
    const keysToCheck = ['DATABASE_URL', 'TURSO_DATABASE_URL', 'TURSO_DB_URL', 'TURSO_AUTH_TOKEN', 'NODE_ENV'];
    keysToCheck.forEach(key => {
        const val = process.env[key];
        diag.env[key] = {
            exists: val !== undefined,
            type: typeof val,
            length: val?.length || 0,
            is_undefined_string: val === "undefined",
            preview: val ? (val.substring(0, 10) + "...") : null
        };
    });

    console.error("🔍 DB DIAGNOSTIC START", JSON.stringify(diag, null, 2));

    try {
        const count = await prisma.user.count();
        const users = await prisma.user.findMany({ select: { email: true } });

        console.error("🔍 DB DIAGNOSTIC SUCCESS - User count:", count);

        return NextResponse.json({
            status: "success",
            count,
            users: users.map(u => u.email), // List emails to verify existence
            nodeVersion: process.version,
            diag
        });
    } catch (error: any) {
        console.error("🔍 DB DIAGNOSTIC FAILED:", error);
        return NextResponse.json({
            status: "error",
            message: error.message,
            code: error.code,
            diag
        }, { status: 500 });
    }
}
