import { prisma } from "./src/lib/prisma";

async function main() {
    console.log("Verifying project prisma client...");
    try {
        const count = await prisma.user.count();
        console.log("Connection successful! User count:", count);

        const subjects = await prisma.subject.findMany({ take: 3 });
        console.log("Data successfully pulled from Turso:");
        subjects.forEach(s => console.log(`- ${s.name}`));
    } catch (e) {
        console.error("Verification failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
