import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const topUsers = await prisma.user.findMany({
            take: 5,
            orderBy: {
                points: 'desc'
            },
            select: {
                id: true,
                name: true,
                points: true,
                level: true
            }
        });

        return NextResponse.json(topUsers);
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
