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

        const achievements = await prisma.achievement.findMany({
            where: { userId: session.user.id }
        });

        // If no achievements, create "First Steps" if user has any attempts
        if (achievements.length === 0) {
            const attemptsCount = await prisma.attempt.count({
                where: { userId: session.user.id }
            });

            if (attemptsCount > 0) {
                const firstAch = await prisma.achievement.create({
                    data: {
                        userId: session.user.id,
                        type: "FIRST_STEPS",
                        name: "İlk Adımlar",
                        description: "İlk testini başarıyla tamamladın!",
                    }
                });
                return NextResponse.json([firstAch]);
            }
        }

        return NextResponse.json(achievements);
    } catch (error) {
        console.error("Achievements error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
