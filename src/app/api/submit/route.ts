import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { calculateLevel, processAchievements } from "@/lib/game-logic";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { subjectId, answers, startTime } = await req.json();

        // 1. Fetch data
        const subject = await prisma.subject.findUnique({
            where: { id: subjectId },
            include: { questions: true }
        });

        if (!subject) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        // 2. Sentinel Speed Check
        const now = new Date();
        const timeElapsedSeconds = (now.getTime() - new Date(startTime).getTime()) / 1000;
        const minimumTimePerQuestion = 0.5;
        if (timeElapsedSeconds < subject.questions.length * minimumTimePerQuestion) {
            return NextResponse.json({ message: "Security Validation Failed: Speed violation" }, { status: 403 });
        }

        // 3. Re-calculate score
        let correct = 0;
        let wrong = 0;
        subject.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctOption) correct++;
            else if (answers[idx] !== undefined) wrong++;
        });

        const total = subject.questions.length;
        const score = total > 0 ? Math.round((correct / total) * 100) : 0;
        const pointsEarned = score * 10;

        // 4. Update data with Game Logic
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user) throw new Error("User not found");

        const newPoints = user.points + pointsEarned;
        const newLevel = calculateLevel(newPoints);

        // Streak logic
        const lastActivity = new Date(user.lastActivity);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastStart = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
        const diffDays = Math.round((todayStart.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24));

        let newStreak = user.streak;
        if (user.streak === 0 || diffDays > 1) newStreak = 1;
        else if (diffDays === 1) newStreak += 1;

        // Transaction for attempt and user update
        const [attempt] = await prisma.$transaction([
            prisma.attempt.create({
                data: { userId: session.user.id, subjectId, score, correct, wrong },
            }),
            prisma.user.update({
                where: { id: session.user.id },
                data: {
                    points: newPoints,
                    level: newLevel,
                    streak: newStreak,
                    lastActivity: now
                }
            })
        ]);

        // 5. Backend Logic: Achievements
        const unlocked = await processAchievements(session.user.id);

        return NextResponse.json({
            attempt,
            streak: newStreak,
            pointsEarned,
            score,
            newAchievements: unlocked
        }, { status: 201 });

    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
