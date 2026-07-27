import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth-server";

export function POST(request: NextRequest) {
	const response = NextResponse.redirect(new URL("/", request.url), 303);
	response.cookies.delete(ADMIN_SESSION_COOKIE);
	return response;
}
