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

        // Find topic with lowest average score
        const topicStats = await prisma.attempt.groupBy({
            by: ["subjectId"],
            where: { userId: session.user.id },
            _avg: { score: true },
            _count: { _all: true },
        });

        if (topicStats.length === 0) {
            return NextResponse.json({ message: "No data yet" });
        }

        // Sort by avg score ascending
        const weakestTopic = topicStats.sort(
            (a: any, b: any) => (a._avg.score || 0) - (b._avg.score || 0)
        )[0];

        const subject = await prisma.subject.findUnique({
            where: { id: weakestTopic.subjectId },
        });

        return NextResponse.json({
            subjectName: subject?.name,
            avgScore: Math.round(weakestTopic._avg.score || 0),
            count: weakestTopic._count._all,
            recommendation: `${subject?.name
                } konusundaki başarın (%${Math.round(
                    weakestTopic._avg.score || 0
                )}) diğerlerine göre biraz daha düşük. Bu konuyu tekrar etmen faydalı olabilir!`,
        });
    } catch (error) {
        console.error("Feedback error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
