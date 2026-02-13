import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        // Daily question doesn't necessarily need auth, but it's good for tracking

        // Get all questions
        const questions = await prisma.question.findMany();
        if (questions.length === 0) {
            return NextResponse.json({ message: "No questions found" }, { status: 404 });
        }

        // Use current date as seed for randomness so it's same for all users today
        const today = new Date().toISOString().split('T')[0];
        const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
        const index = seed % questions.length;

        const dailyQuestion = questions[index];
        const subject = await prisma.subject.findUnique({ where: { id: dailyQuestion.subjectId } });

        return NextResponse.json({
            ...dailyQuestion,
            options: JSON.parse(dailyQuestion.options),
            subjectName: subject?.name || "Genel",
        });
    } catch (error) {
        console.error("Daily question fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
