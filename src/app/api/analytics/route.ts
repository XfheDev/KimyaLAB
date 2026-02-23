import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Get last 7 days activity counts
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const logs = await prisma.activityLog.findMany({
            where: {
                userId: session.user.id,
                createdAt: { gte: sevenDaysAgo }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Group by day for a mini-chart/heatmap logic
        const activityByDay: Record<string, number> = {};
        logs.forEach(log => {
            const day = log.createdAt.toISOString().split('T')[0];
            activityByDay[day] = (activityByDay[day] || 0) + 1;
        });

        // Achievement Stats
        const achievementCount = await prisma.achievement.count({
            where: { userId: session.user.id }
        });

        return NextResponse.json({
            activityByDay,
            totalLogs: logs.length,
            achievementCount,
            recentLogs: logs.slice(0, 10)
        });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching analytics" }, { status: 500 });
    }
}
