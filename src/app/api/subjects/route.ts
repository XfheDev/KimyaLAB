import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();

        // Fetch all subjects simply
        const subjects = await prisma.subject.findMany({
            include: {
                _count: {
                    select: { questions: true },
                }
            },
        });

        // Add 'isLocked' as false for all (maintaining backward compatibility with UI if needed, 
        // though I previously updated the UI to ignore it)
        const enhancedSubjects = subjects.map(subject => ({
            ...subject,
            isLocked: false
        }));

        return NextResponse.json(enhancedSubjects);
    } catch (error) {
        console.error("Subjects API Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
