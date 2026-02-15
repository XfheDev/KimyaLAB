import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const saveSchema = z.object({
    questionId: z.string(),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
        }

        const body = await req.json();
        const result = saveSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });
        }

        const { questionId } = result.data;
        const userEmail = session.user.email;

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        // Check if already saved
        const existing = await prisma.savedQuestion.findUnique({
            where: {
                userId_questionId: {
                    userId: user.id,
                    questionId: questionId,
                },
            },
        });

        if (existing) {
            // Unsave
            await prisma.savedQuestion.delete({
                where: { id: existing.id },
            });
            return NextResponse.json({ saved: false, message: "Soru kaydedilenlerden çıkarıldı." });
        } else {
            // Save
            await prisma.savedQuestion.create({
                data: {
                    userId: user.id,
                    questionId: questionId,
                },
            });
            return NextResponse.json({ saved: true, message: "Soru kaydedildi." });
        }

    } catch (error) {
        console.error("Save question error:", error);
        return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
    }
}
