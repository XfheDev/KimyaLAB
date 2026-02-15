import { defineConfig } from "prisma/config";

// Minimal config to avoid interfere with runtime env
export default defineConfig({
  schema: "prisma/schema.prisma",
});
