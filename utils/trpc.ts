import { QueryCache, QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpLink,
  splitLink,
  loggerLink,
  httpBatchLink,
} from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/routers/index";
import { toast } from "sonner";
import nextConfig from "@/next.config";

// 1. Create custom batchLink with batchGroup support
const customBatchLink = httpBatchLink({
  url: `${nextConfig.env?.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
  headers() {
    return {};
  },
  maxItems: 10,
});

// 2. Compose link using splitLink for conditional batching
const url = `${nextConfig.env?.NEXT_PUBLIC_SERVER_URL}/api/trpc`;

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink(),
    splitLink({
      condition: (op) => op.context?.useBatch === true,
      true: customBatchLink,
      false: httpLink({ url }),
    }),
  ],
});

// 3. Query Client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: "retry",
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

// 4. Create the React hooks wrapper
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
