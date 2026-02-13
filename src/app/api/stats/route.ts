import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { name: true, points: true, level: true, streak: true },
        });

        console.log("Stats API - Session ID:", session.user.id);
        console.log("Stats API - Fetched User:", user?.name, user?.points);

        const attempts = await prisma.attempt.findMany({
            where: { userId: session.user.id },
            orderBy: { date: "desc" },
            include: { subject: true },
        });

        const totalTests = attempts.length;
        const avgScore =
            totalTests > 0
                ? Math.round(
                    attempts.reduce(
                        (acc: number, curr: any) => acc + curr.score,
                        0
                    ) / totalTests
                )
                : 0;

        // Last 5 attempts
        const lastAttempts = attempts.slice(0, 5);

        // Topic based stats
        const topicStats = await prisma.attempt.groupBy({
            by: ["subjectId"],
            where: { userId: session.user.id },
            _avg: { score: true },
            _count: { _all: true },
        });

        // Fetch subject names for topic stats
        const subjects = await prisma.subject.findMany();
        const formattedTopicStats = topicStats.map((stat: any) => ({
            name:
                subjects.find((s: any) => s.id === stat.subjectId)?.name ||
                "Bilinmiyor",
            avgScore: Math.round(stat._avg.score || 0),
            count: stat._count._all,
        }));

        const achievements = await prisma.achievement.findMany({
            where: { userId: session.user.id },
            orderBy: { unlockedAt: "desc" },
        });

        return NextResponse.json({
            totalTests,
            avgScore,
            lastAttempts,
            topicStats: formattedTopicStats,
            achievements,
            user: {
                name: user?.name || "Kullanıcı",
                points: user?.points || 0,
                level: user?.level || 1,
                streak: user?.streak || 0,
            }
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
