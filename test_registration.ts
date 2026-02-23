import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    console.log("Testing user registration...");
    const email = "test@example.com";
    const password = "password123";
    const name = "Test User";

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        console.log("User created successfully:", user.email);

        // Cleanup
        await prisma.user.delete({ where: { email: user.email } });
        console.log("Test user deleted.");
    } catch (e) {
        console.error("Registration test failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
