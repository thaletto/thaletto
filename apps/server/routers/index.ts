import { router } from "../lib/trpc";
import { testRouter } from "./test";
import { userRouter } from "./user";

export const appRouter = router({
  test: testRouter,
  user: userRouter
});
export type AppRouter = typeof appRouter;