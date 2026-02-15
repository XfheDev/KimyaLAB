import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                savedQuestions: {
                    include: {
                        question: {
                            include: {
                                subject: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        // Transform data to return flat question objects with saved metadata if needed
        const savedQuestions = user.savedQuestions.map(sq => ({
            ...sq.question,
            savedAt: sq.createdAt,
            savedId: sq.id,
            // Parse options if they are stored as JSON string
            options: JSON.parse(sq.question.options as string)
        }));

        return NextResponse.json(savedQuestions);

    } catch (error) {
        console.error("Fetch saved questions error:", error);
        return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
    }
}
