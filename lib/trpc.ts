import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "@/lib/context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

