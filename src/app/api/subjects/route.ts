import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();

        // Fetch subjects with prerequisites
        const subjects = await prisma.subject.findMany({
            include: {
                _count: {
                    select: { questions: true },
                },
                prerequisites: {
                    select: { id: true, name: true }
                }
            },
        });

        // If user is logged in, fetch their completed subject IDs
        let completedSubjectIds: string[] = [];
        if (session?.user?.id) {
            const attempts = await prisma.attempt.findMany({
                where: {
                    userId: session.user.id,
                    score: { gte: 70 } // Consider it "unlocked" next level if score >= 70%
                },
                select: { subjectId: true },
                distinct: ['subjectId']
            });
            completedSubjectIds = attempts.map(a => a.subjectId);
        }

        // Add 'isLocked' status to subjects
        const enhancedSubjects = subjects.map(subject => {
            const isLocked = subject.prerequisites.length > 0 &&
                !subject.prerequisites.every(p => completedSubjectIds.includes(p.id));

            return {
                ...subject,
                isLocked
            };
        });

        return NextResponse.json(enhancedSubjects);
    } catch (error) {
        console.error("Subjects API Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
