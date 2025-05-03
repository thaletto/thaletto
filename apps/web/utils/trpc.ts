import { QueryCache, QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink, httpLink, splitLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouter } from '../../../server/src/routers';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
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

const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/trpc`;

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition(op) {
        // If you want to skip batching for a request, set op.context.skipBatch = true
        return op.context?.skipBatch === true;
      },
      true: httpLink({ url }),
      false: httpBatchLink({ url }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

