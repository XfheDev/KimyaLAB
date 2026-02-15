import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "",
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN || "",
  },
  // Re-enable this if you want to use Edge runtime, but for now we stay Node
};

export default nextConfig;
