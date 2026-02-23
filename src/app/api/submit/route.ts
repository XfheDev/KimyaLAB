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

        const { subjectId, answers, startTime } = await req.json();

        // 1. Fetch the actual questions to verify answers
        const subject = await prisma.subject.findUnique({
            where: { id: subjectId },
            include: { questions: true }
        });

        if (!subject) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        // 2. Anti-Cheat: Validate time elapsed
        const now = new Date();
        const timeElapsedSeconds = (now.getTime() - new Date(startTime).getTime()) / 1000;

        // If they finished 5 questions in under 2 seconds, its probably a bot
        const minimumTimePerQuestion = 0.5; // very generous
        if (timeElapsedSeconds < subject.questions.length * minimumTimePerQuestion) {
            console.warn(`[SENTINEL] Cheat detected for user ${session.user.id}: finished too fast (${timeElapsedSeconds}s)`);
            return NextResponse.json({ message: "Security Validation Failed: Speed violation" }, { status: 403 });
        }

        // 3. Re-calculate score on server
        let correct = 0;
        let wrong = 0;

        subject.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctOption) {
                correct++;
            } else if (answers[idx] !== undefined) {
                wrong++;
            }
        });

        const total = subject.questions.length;
        const score = total > 0 ? Math.round((correct / total) * 100) : 0;
        const pointsEarned = score * 10;

        // 4. Update user and record attempt
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        }) as any;

        if (!user) throw new Error("User not found");

        const newPoints = user.points + pointsEarned;
        const newLevel = Math.floor(newPoints / 1000) + 1;

        // Streak logic
        const lastActivity = new Date(user.lastActivity);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastStart = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
        const diffDays = Math.round((todayStart.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24));

        let newStreak = user.streak;
        if (user.streak === 0) {
            newStreak = 1;
        } else if (diffDays === 1) {
            newStreak += 1;
        } else if (diffDays > 1) {
            newStreak = 1;
        }

        const [attempt] = await prisma.$transaction([
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
            pointsEarned,
            score
        }, { status: 201 });

    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
