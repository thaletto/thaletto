import { router, publicProcedure } from "../lib/trpc";
import { z } from "zod";
import { notion } from "@/lib/notion";

export const testRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),

  greet: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello, ${input.name}!`),

  listDatabases: publicProcedure.query(async () => {
    const response = await notion.search({});

    return response.results.map((db: any) => ({
      id: db.id,
      title: db.title?.[0]?.plain_text || "Untitled",
    }));
  }),
});
