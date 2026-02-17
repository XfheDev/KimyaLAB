import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
    url: url!,
    authToken: authToken,
});

const adapter = new PrismaLibSql(client);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Verifying database content...");
    console.log("URL:", url);

    const userCount = await prisma.user.count();
    const subjectCount = await prisma.subject.count();
    const questionCount = await prisma.question.count();

    console.log("--- RESULTS ---");
    console.log(`Users: ${userCount}`);
    console.log(`Subjects: ${subjectCount}`);
    console.log(`Questions: ${questionCount}`);

    if (subjectCount > 0 && questionCount > 0) {
        console.log("✅ Database is populated!");
    } else {
        console.log("❌ Database appears empty.");
    }
}

main();
