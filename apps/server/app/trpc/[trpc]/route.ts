import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/routers";
import { createContext } from "@/lib/context";
import { NextRequest, NextResponse } from "next/server";

const CORS_ORIGIN = process.env.NEXT_PUBLIC_CORS_ORIGIN || "*";

function setCorsHeaders(response: Response) {
  response.headers.set("Access-Control-Allow-Origin", CORS_ORIGIN);
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );
  return response;
}

async function handler(req: NextRequest) {
  const response = await fetchRequestHandler({
    endpoint: "/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
  });
  return setCorsHeaders(response as Response);
}

export { handler as GET, handler as POST };

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}
