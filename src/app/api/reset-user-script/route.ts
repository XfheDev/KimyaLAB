import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const email = "test@example.com";
        const password = "123456";
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("🛠️ Resetting/Creating user:", email);

        const user = await prisma.user.upsert({
            where: { email },
            update: { password: hashedPassword },
            create: {
                email,
                password: hashedPassword,
                name: "Test Kullanıcısı",
                level: 1,
                points: 0,
                streak: 0,
            },
        });

        console.log("✅ User reset successful:", user.id);

        return NextResponse.json({
            message: "Kullanıcı başarıyla oluşturuldu/sıfırlandı.",
            user: { email: user.email, id: user.id }
        });
    } catch (error: any) {
        console.error("❌ Reset Error:", error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
