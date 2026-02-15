import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  // We leave datasource config to schema.prisma to avoid conflicts
  // and ensure runtime client behavior is standard.
});
