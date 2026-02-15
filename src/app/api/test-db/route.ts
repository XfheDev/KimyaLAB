import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    console.error("🔍 DB DIAGNOSTIC START");
    try {
        // Test simple query
        const count = await prisma.user.count();
        console.error("🔍 DB DIAGNOSTIC SUCCESS - User count:", count);
        return NextResponse.json({ status: "success", count });
    } catch (error: any) {
        console.error("🔍 DB DIAGNOSTIC FAILED:", error);
        return NextResponse.json({
            status: "error",
            message: error.message,
            code: error.code,
            stack: error.stack
        }, { status: 500 });
    }
}
