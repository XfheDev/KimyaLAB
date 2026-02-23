import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const notes = await prisma.note.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching notes" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { content, subjectId } = await req.json();

        const note = await prisma.note.create({
            data: {
                content,
                userId: session.user.id,
                subjectId: subjectId || undefined // Optional link to subject
            }
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating note" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await req.json();

        await prisma.note.delete({
            where: {
                id,
                userId: session.user.id // Ensure they own it
            }
        });

        return NextResponse.json({ message: "Note deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting note" }, { status: 500 });
    }
}
