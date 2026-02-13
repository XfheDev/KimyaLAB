import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const url = process.env.DATABASE_URL || "file:./dev.db";
const libsql = createClient({ url });
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Starting large scale seeding...");

    // Read question data
    const dataPath = path.join(__dirname, "questions_data.json");
    const subjectsData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    // Clear existing data safely
    // Note: Delete in order of dependencies
    await prisma.attempt.deleteMany();
    await prisma.question.deleteMany();
    await prisma.subject.deleteMany();

    console.log("Existing data cleared.");

    for (const item of subjectsData) {
        console.log(`Processing subject: ${item.subject}...`);

        // Create or find Subject
        const subject = await prisma.subject.upsert({
            where: { name: item.subject },
            update: {},
            create: { name: item.subject },
        });

        // Batch create questions for this subject
        const questionsToCreate = item.questions.map((q: any) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            correctOption: q.correctOption,
            subjectId: subject.id,
        }));

        // Use createMany for efficiency (SQLite adapter supports it via Prisma 7)
        const result = await prisma.question.createMany({
            data: questionsToCreate,
        });

        console.log(`Created ${result.count} questions for ${item.subject}.`);
    }

    const totalQuestions = await prisma.question.count();
    const totalSubjects = await prisma.subject.count();

    console.log(`Seeding finished successfully!`);
    console.log(`Total Subjects: ${totalSubjects}`);
    console.log(`Total Questions: ${totalQuestions}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
