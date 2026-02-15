import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateProfileSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır").max(50, "İsim en fazla 50 karakter olabilir").optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır").optional(),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
        }

        const body = await req.json();
        const result = updateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, currentPassword, newPassword } = result.data;
        const userEmail = session.user.email;

        // Fetch current user data (especially password hash)
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        const updateData: any = {};

        // Update Name if provided
        if (name && name !== user.name) {
            updateData.name = name;
        }

        // Update Password if provided
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: "Şifre değiştirmek için mevcut şifrenizi girmelisiniz." }, { status: 400 });
            }

            // Verify current password
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                return NextResponse.json({ error: "Mevcut şifreniz hatalı." }, { status: 400 });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "Değişiklik yapılmadı." });
        }

        // Perform Update
        await prisma.user.update({
            where: { email: userEmail },
            data: updateData,
        });

        return NextResponse.json({ message: "Profil başarıyla güncellendi." });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
    }
}
