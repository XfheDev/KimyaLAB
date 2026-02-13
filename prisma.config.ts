import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
console.log("Prisma Config - Using URL:", dbUrl.startsWith("libsql") ? "TURSO (Remote)" : "SQLite (Local)");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: dbUrl,
  }
});
