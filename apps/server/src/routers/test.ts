import { router, publicProcedure } from "../lib/trpc";
import { z } from "zod";

export const testRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  greet: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello, ${input.name}!`),
  currentTime: publicProcedure.query(() => new Date().toISOString()),
}); 