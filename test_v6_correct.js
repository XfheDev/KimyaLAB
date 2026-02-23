const { PrismaClient } = require("@prisma/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");
require("dotenv").config();

async function main() {
    const url = process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
        console.error("DATABASE_URL is not set");
        return;
    }

    console.log("Testing Prisma 6 Factory usage...");

    try {
        // PASS THE FACTORY DIRECTLY
        const adapter = new PrismaLibSQL({ url, authToken });
        const prisma = new PrismaClient({ adapter });

        console.log("Executing count...");
        const count = await prisma.user.count();
        console.log("Count successful:", count);

        const subjects = await prisma.subject.findMany({ take: 5 });
        console.log("Subjects found:", subjects.length);
        subjects.forEach(s => console.log("- " + s.name));

        await prisma.$disconnect();
    } catch (e) {
        console.error("Test failed:", e);
    }
}

main();
