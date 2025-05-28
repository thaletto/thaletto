# Full Guide: API Creation and Usage

---

## Backend

### 1. How to Create an API

**a. Create a Router File**

Each API group should have its own router file in `apps/server/src/routers/`.

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

**b. Register Routers in `index.ts`**

Combine all routers in `apps/server/src/routers/index.ts`:

```ts
import { router } from "../lib/trpc";
import { testRouter } from "./test";

export const appRouter = router({
  test: testRouter,
  // Add more routers here
});
export type AppRouter = typeof appRouter;
```

---

### 2. How to Call the API (Server-side Fetch)

**a. Using tRPC Client (Recommended for Type Safety)**

If you need to call your own API from the backend (e.g., for SSR or internal jobs), use the tRPC client:

```ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './routers';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({ url: 'http://localhost:3000/api/trpc' }),
  ],
});

const result = await trpc.test.greet.query({ name: "Laxman" });
```

**b. Using Fetch API (Raw HTTP Call)**

You can also call your API endpoints using the native `fetch`:

```ts
const response = await fetch('http://localhost:3000/api/trpc/test.greet?input=' + encodeURIComponent(JSON.stringify({ name: "Laxman" })));
const data = await response.json();
```

**Options Available:**
- **tRPC Client:** Type-safe, supports batching, error handling, and middleware.
- **Fetch API:** Universal, but you must handle serialization, errors, and batching manually.

---

## Frontend

### 1. Calling the API

```ts
import { trpc } from "../utils/trpc";

// Query example
const greet = useQuery({
  ...trpc.test.greet.queryOptions({ name: "Laxman" }),
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchInterval: false,
  });
```

### 2. Batching

tRPC supports request batching out of the box. To enable batching, ensure your tRPC client is set up with `httpBatchLink`:

```ts
import { httpBatchLink } from '@trpc/client';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({ url: '/api/trpc' }),
  ],
});
```

React Query hooks will automatically batch requests made in the same tick.

**Skip Batching**

```ts
const currentTime = useQuery({
    ...trpc.test.currentTime.queryOptions(undefined, {
      meta: { context: { skipBatch: true } }
    }),
    refetchInterval: 5000,
  });
```

---

### 3. Refetching


**Automatic Refetch (Polling)**

```ts
const { data } = trpc.test.greet.useQuery(
  { name: "Laxman" },
  { refetchInterval: 5000 } // Refetch every 5 seconds
);
```

**Refetch on Window Focus**

```ts
const { data } = trpc.test.greet.useQuery(
  { name: "Laxman" },
  { refetchOnWindowFocus: true }
);
```

---

## Summary Table

| Task                | Backend (tRPC)         | Frontend (tRPC)         |
|---------------------|------------------------|-------------------------|
| Create API          | `router` + `procedure` | N/A                     |
| Call API            | `trpcClient.query()`   | `useQuery()`            |
| Batching            | `httpBatchLink`        | `httpBatchLink`         |                   |
| Refetch             | N/A                    | `refetch()`, polling    |                   |

---

## Best Practices

- Use tRPC client for type safety and batching.
- Use React Query hooks for frontend data fetching, caching, and refetching.
- Use fetch only for non-tRPC endpoints or when you need full control.
- Group related endpoints in routers and register them in `index.ts`. 