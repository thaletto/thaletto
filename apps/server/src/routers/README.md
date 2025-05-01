# Organizing Routers and APIs

## 1. Creating Multiple APIs in a Single File

You can group related API endpoints in a single router file. For example, in `test.ts`:

```ts
// apps/server/src/routers/test.ts
import { router, publicProcedure } from "../lib/trpc";
import { z } from "zod";

export const testRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  greet: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello, ${input.name}!`),
});
```

## 2. Registering Routers in `index.ts`

Import your router(s) and add them to the main `appRouter`:

```ts
// apps/server/src/routers/index.ts
import { router } from "../lib/trpc";
import { testRouter } from "./test";

export const appRouter = router({
  test: testRouter,
});
export type AppRouter = typeof appRouter;
```

This will namespace your endpoints as `test.healthCheck` and `test.greet`.

## 3. Calling APIs from the Frontend

Assuming you use tRPC on the frontend, you can call these endpoints like this:

```ts
// Example using @trpc/react-query
import { trpc } from "../utils/trpc";

// Query healthCheck
const healthCheck = useQuery(trpc.test.healthCheck.queryOptions());

// Query greet
const greet = useQuery(trpc.test.greet.queryOptions({ name: "Laxman" }));
```

Make sure your frontend is set up to use the tRPC client and points to your backend's tRPC handler.

---

**Summary:**
- Group related endpoints in their own router files.
- Register them in `index.ts` for namespacing.
- Call them from the frontend using the namespaced path (e.g., `test.greet`). 