import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/routers";
import { createContext } from "@/lib/context";
import { NextRequest, NextResponse } from "next/server";
import nextConfig from "@/next.config";

async function handler(req: NextRequest) {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
  });

  return response as Response;
}

export { handler as GET, handler as POST };

export async function OPTIONS() {
	const response = new NextResponse(null, {status: 204})
	return response;
}