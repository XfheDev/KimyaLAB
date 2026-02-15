import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import QuizSession from "@/components/QuizSession";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function QuizPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();

    const subject = await prisma.subject.findUnique({
        where: { id },
        include: {
            questions: true,
        },
    });

    if (!subject) notFound();

    // Pick 10 random questions or more if available
    const questions = (subject.questions as any[])
        .sort(() => 0.5 - Math.random())
        .slice(0, 10)
        .map((q: any) => ({
            ...q,
            options: JSON.parse(q.options),
        }));

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 transition-colors duration-500">
            <QuizSession
                questions={questions}
                subjectId={subject.id}
                subjectName={subject.name}
            />
        </div>
    );
}
