import "dotenv/config";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log(`🔗 URL: ${url.substring(0, 30)}...`);

const client = createClient({ url, authToken });

async function main() {
    const subjects = await client.execute("SELECT COUNT(*) as count FROM Subject");
    const questions = await client.execute("SELECT COUNT(*) as count FROM Question");
    const users = await client.execute("SELECT COUNT(*) as count FROM User");

    console.log("--- TURSO DATABASE CONTENT ---");
    console.log(`Subjects: ${subjects.rows[0].count}`);
    console.log(`Questions: ${questions.rows[0].count}`);
    console.log(`Users: ${users.rows[0].count}`);
}

main().catch(e => { console.error("ERROR:", e); process.exit(1); });
