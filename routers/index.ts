import { router } from "@/lib/trpc";
import { testRouter } from "@/routers/test";
import { userRouter } from "@/routers/user";

export const appRouter = router({
  test: testRouter,
  user: userRouter
});
export type AppRouter = typeof appRouter;