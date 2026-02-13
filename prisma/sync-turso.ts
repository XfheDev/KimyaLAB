import { createClient } from "@libsql/client";
import { execSync } from "child_process";
import "dotenv/config";

async function sync() {
    const url = process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !url.startsWith("https") && !url.startsWith("libsql")) {
        console.error("❌ Hata: DATABASE_URL geçerli bir Turso adresi olmalı (https://... veya libsql://...)");
        process.exit(1);
    }

    console.log("🚀 Turso Senkronizasyonu Başlıyor...");
    console.log(`🔗 Hedef: ${url}`);

    try {
        const client = createClient({ url, authToken });

        console.log("📦 SQL oluşturuluyor (Prisma migrate diff)...");
        // Generate the SQL from the schema
        const sql = execSync("npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script", {
            encoding: "utf-8",
            env: { ...process.env, DATABASE_URL: "file:./dev.db" } // Dummy URL for diff
        });

        console.log("⚡ SQL Turso'ya aktarılıyor...");

        // Execute the SQL statements
        // Split by semicolon but be careful with complex statements (prisma diff is usually simple enough)
        const statements = sql.split(";").filter(s => s.trim().length > 0);

        for (const statement of statements) {
            await client.execute(statement);
        }

        console.log("✅ Başarılı! Veritabanı tabloları Turso üzerinde oluşturuldu.");
    } catch (error: any) {
        console.error("❌ Hata oluştu:", error.message);
        process.exit(1);
    }
}

sync();
