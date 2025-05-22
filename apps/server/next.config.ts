import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    CORS_ORIGIN: process.env.NODE_ENV == "development" ? 'http://localhost:300': 'https://www.thaletto.dev',

    // Notion
    NOTION_TOKEN: process.env.NOTION_TOKEN || "",
    NOTION_EDUCATION_DB_ID: "1fbf3dd03157801eab9cf98d6cbf4987",
    NOTION_EXPERIENCE_DB_ID: "1fbf3dd0315780c0bca1cceef54cafd6",
  }
};

export default nextConfig;
