import "dotenv/config";
import { createClient } from "@libsql/client";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from "fs";
import path from "path";

const url = process.env.DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log(`🔗 Connecting to: ${url.substring(0, 30)}...`);
console.log(`🔑 Token: ${authToken ? "YES" : "NO"}`);

const client = createClient({ url, authToken });

// ======= STEP 1: CREATE TABLES =======
async function createTables() {
    console.log("\n📦 STEP 1: Creating tables...");

    const statements = [
        `CREATE TABLE IF NOT EXISTS "User" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "email" TEXT NOT NULL,
            "password" TEXT NOT NULL,
            "name" TEXT,
            "points" INTEGER NOT NULL DEFAULT 0,
            "level" INTEGER NOT NULL DEFAULT 1,
            "streak" INTEGER NOT NULL DEFAULT 0,
            "lastActivity" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL
        )`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,

        `CREATE TABLE IF NOT EXISTS "Achievement" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "type" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "userId" TEXT NOT NULL,
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
        )`,

        `CREATE TABLE IF NOT EXISTS "Subject" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "name" TEXT NOT NULL
        )`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "Subject_name_key" ON "Subject"("name")`,

        `CREATE TABLE IF NOT EXISTS "Question" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "text" TEXT NOT NULL,
            "options" TEXT NOT NULL,
            "correctOption" INTEGER NOT NULL,
            "subjectId" TEXT NOT NULL,
            FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE
        )`,

        `CREATE TABLE IF NOT EXISTS "Attempt" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "userId" TEXT NOT NULL,
            "subjectId" TEXT NOT NULL,
            "score" INTEGER NOT NULL,
            "correct" INTEGER NOT NULL,
            "wrong" INTEGER NOT NULL,
            "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
            FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE
        )`,
    ];

    for (const sql of statements) {
        await client.execute(sql);
    }
    console.log("✅ All tables created!");
}

// ======= STEP 2: SEED DATA =======
async function seedData() {
    console.log("\n🌱 STEP 2: Seeding data...");

    const adapter = new PrismaLibSql({ url, authToken });
    const prisma = new PrismaClient({ adapter });

    const dataPath = path.join(__dirname, "prisma", "questions_data.json");
    const subjectsData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    // Clear existing data
    await prisma.attempt.deleteMany();
    await prisma.question.deleteMany();
    await prisma.subject.deleteMany();
    console.log("Existing data cleared.");

    for (const item of subjectsData) {
        console.log(`Processing: ${item.subject}...`);

        const subject = await prisma.subject.upsert({
            where: { name: item.subject },
            update: {},
            create: { name: item.subject },
        });

        const questionsToCreate = item.questions.map((q: any) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            correctOption: q.correctOption,
            subjectId: subject.id,
        }));

        const result = await prisma.question.createMany({
            data: questionsToCreate,
        });

        console.log(`  Created ${result.count} questions.`);
    }

    const totalSubjects = await prisma.subject.count();
    const totalQuestions = await prisma.question.count();

    console.log(`\n🎉 DONE! Subjects: ${totalSubjects}, Questions: ${totalQuestions}`);
    await prisma.$disconnect();
}

// ======= RUN =======
async function main() {
    await createTables();
    await seedData();
}

main().catch((e) => {
    console.error("❌ FATAL ERROR:", e);
    process.exit(1);
});
