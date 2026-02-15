import { prisma } from "./src/lib/prisma";

async function check() {
    try {
        const count = await prisma.user.count();
        console.log(`User Count: ${count}`);
        const users = await prisma.user.findMany({
            select: { email: true }
        });
        console.log("Registered Emails:");
        users.forEach(u => console.log(`- ${u.email}`));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
