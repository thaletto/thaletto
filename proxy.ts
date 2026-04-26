import { type NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function proxy(request: NextRequest) {
	if (process.env.NODE_ENV !== "production") {
		return NextResponse.next();
	}

	let sessionId = request.cookies.get("session_id")?.value;

	if (!sessionId) {
		sessionId = crypto.randomUUID();
	}

	const dedupeKey = `viewed:global:${sessionId}`;
	const alreadyViewed = await redis.get(dedupeKey);

	if (alreadyViewed) {
		return NextResponse.next();
	}

	await redis
		.multi()
		.set(dedupeKey, 1, { EX: 60 * 60 * 24 })
		.incr("views:global")
		.exec();

	const response = NextResponse.next();
	response.cookies.set("session_id", sessionId, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 365,
		path: "/",
	});

	return response;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
