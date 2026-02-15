import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // This is used for migration and generation
    // We provide a dummy default to ensure 'prisma generate' always works
    url: process.env.DATABASE_URL || "file:./dev.db"
  }
});
