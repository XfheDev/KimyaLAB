import "dotenv/config";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
    console.log("Checking Turso Database...");
    try {
        const subjects = await client.execute("SELECT COUNT(*) as count FROM Subject");
        const questions = await client.execute("SELECT COUNT(*) as count FROM Question");
        const users = await client.execute("SELECT email FROM User");

        console.log("--- RESULTS ---");
        console.log(`Subjects: ${subjects.rows[0].count}`);
        console.log(`Questions: ${questions.rows[0].count}`);
        console.log("Users:", users.rows.map(r => r.email).join(", ") || "(none)");
    } catch (e) {
        console.error("Database check failed:", e);
    }
}

main();
