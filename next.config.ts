import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://api.thaletto.dev",
    NOTION_TOKEN: process.env.NOTION_TOKEN || "",
    NOTION_EDUCATION_DB_ID: "1fbf3dd03157801eab9cf98d6cbf4987",
    NOTION_EXPERIENCE_DB_ID: "1fbf3dd0315780c0bca1cceef54cafd6",
  },
};

export default nextConfig;
