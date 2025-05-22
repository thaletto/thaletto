import { publicProcedure, router } from "../lib/trpc";
import nextConfig from "@/next.config";
import { notion, formatNotionResponse } from "@/lib/notion";

export const userRouter = router({
  education: publicProcedure.query(async function () {
    const education_db_id = nextConfig.env?.NOTION_EDUCATION_DB_ID ?? "";
    if (!education_db_id) throw new Error("Education DB ID is required");

    const response = await notion.databases.query({
      database_id: education_db_id,
    });

    return formatNotionResponse(response.results);
  }),

  experience: publicProcedure.query(async function () {
    const experience_db_id = nextConfig.env?.NOTION_EXPERIENCE_DB_ID ?? "";
    if (!experience_db_id) throw new Error("Experience DB ID is required");

    const response = await notion.databases.query({
      database_id: experience_db_id,
    });

    return formatNotionResponse(response.results);
  }),
});
