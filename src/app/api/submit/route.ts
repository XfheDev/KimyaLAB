import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { subjectId, score, correct, wrong } = await req.json();

        // Calculate XP: 10 points per 1% score
        const pointsEarned = score * 10;

        const user = await prisma.user.findUnique({
            where: { id: session.user.id } as any
        }) as any;

        if (!user) throw new Error("User not found");

        // Gamification logic
        const newPoints = user.points + pointsEarned;
        const newLevel = Math.floor(newPoints / 1000) + 1;

        // Simple streak logic
        const now = new Date();
        const lastActivity = new Date(user.lastActivity);
        const dayDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

        let newStreak = user.streak;

        // Calculate days since last activity
        // Reset time to midnight for accurate day difference
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastStart = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
        const diffDays = Math.round((todayStart.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24));

        if (user.streak === 0) {
            newStreak = 1;
        } else if (diffDays === 1) {
            newStreak += 1;
        } else if (diffDays > 1) {
            newStreak = 1;
        }
        // If diffDays is 0, streak remains the same

        // Update user and create attempt
        const [attempt, updatedUser] = await prisma.$transaction([
            prisma.attempt.create({
                data: {
                    userId: session.user.id,
                    subjectId,
                    score,
                    correct,
                    wrong,
                },
            }),
            prisma.user.update({
                where: { id: session.user.id },
                data: {
                    points: newPoints,
                    level: newLevel,
                    streak: newStreak,
                    lastActivity: now
                } as any
            })
        ]) as any;

        return NextResponse.json({
            attempt,
            streak: newStreak,
            pointsEarned
        }, { status: 201 });
    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
