import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
	if (request.cookies.has("session_id")) {
		return NextResponse.next();
	}
	const response = NextResponse.next();
	response.cookies.set("session_id", crypto.randomUUID(), {
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 365,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});
	return response;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
