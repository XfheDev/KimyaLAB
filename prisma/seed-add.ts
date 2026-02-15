import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const url = process.env.DATABASE_URL || "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Starting additive seeding...");

    const dataPath = path.join(__dirname, "new_questions_data.json");
    if (!fs.existsSync(dataPath)) {
        console.error("new_questions_data.json not found!");
        return;
    }
    const subjectsData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    for (const item of subjectsData) {
        console.log(`Processing subject: ${item.subject}...`);

        const subject = await prisma.subject.upsert({
            where: { name: item.subject },
            update: {},
            create: { name: item.subject },
        });

        let addedCount = 0;
        for (const q of item.questions) {
            // Check if question exists to avoid duplicates (optional but good practice)
            // Ideally we check by text or a unique code. Here we just add.
            // Or we can check if a question with same text exists in this subject.
            const existing = await prisma.question.findFirst({
                where: {
                    text: q.text,
                    subjectId: subject.id
                }
            });

            if (!existing) {
                await prisma.question.create({
                    data: {
                        text: q.text,
                        options: JSON.stringify(q.options),
                        correctOption: q.correctOption,
                        subjectId: subject.id,
                    }
                });
                addedCount++;
            }
        }

        console.log(`Added ${addedCount} new questions for ${item.subject}.`);
    }

    console.log(`Additive seeding finished successfully!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
