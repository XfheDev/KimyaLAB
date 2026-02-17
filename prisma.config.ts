import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        // This provides the URL for migration/push/generate steps
        url: process.env.DATABASE_URL || "file:./dev.db"
    }
});
