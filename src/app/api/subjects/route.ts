import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                _count: {
                    select: { questions: true },
                },
            },
        });
        return NextResponse.json(subjects);
    } catch (error) {
        console.error("Subjects API Error:", error);
        return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 });
    }
}
