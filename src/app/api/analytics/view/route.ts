import { type NextRequest, NextResponse } from "next/server";
import {
	analyticsRateLimitKey,
	anonymousSessionVisitorKey,
	createRedisAnalyticsStore,
	dailyIpVisitorKey,
	deviceClass,
	recordView,
	referrerDomain,
} from "@/lib/analytics";
import { ANALYTICS_ROUTES } from "@/lib/analytics-routes";
import { ensureRedis, redis } from "@/lib/redis";

function requestIp(request: NextRequest) {
	return (
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		request.headers.get("x-real-ip") ||
		"unknown"
	);
}

export async function POST(request: NextRequest) {
	const requestOrigin = new URL(request.url).origin;
	const suppliedOrigin = request.headers.get("origin");
	if (suppliedOrigin && suppliedOrigin !== requestOrigin) {
		return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
	}

	const available = await ensureRedis();
	if (!available) {
		return NextResponse.json({ collected: false }, { status: 202 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}
	const pathname =
		typeof body === "object" &&
		body !== null &&
		"pathname" in body &&
		typeof body.pathname === "string"
			? body.pathname
			: "";
	if (!ANALYTICS_ROUTES.has(pathname)) {
		return NextResponse.json({ error: "Invalid pathname" }, { status: 400 });
	}

	const date = new Date().toISOString().slice(0, 10);
	const sessionId = request.cookies.get("session_id")?.value;
	const secret = process.env.ANALYTICS_HASH_SECRET;
	if (!secret) {
		return NextResponse.json(
			{ error: "Analytics hash secret is not configured" },
			{ status: 503 }
		);
	}
	const visitorKey = sessionId
		? anonymousSessionVisitorKey(sessionId, secret)
		: dailyIpVisitorKey(requestIp(request), date, secret);
	const accepted = await redis.set(
		analyticsRateLimitKey(visitorKey, secret),
		"1",
		{
			EX: 2,
			NX: true,
		}
	);
	if (!accepted) {
		return NextResponse.json({ collected: false }, { status: 202 });
	}

	await recordView(createRedisAnalyticsStore(redis), {
		date,
		device: deviceClass(request.headers.get("user-agent") ?? ""),
		pathname,
		referrerDomain: referrerDomain(
			request.headers.get("referer") ?? "",
			requestOrigin
		),
		visitorKey,
	});
	return NextResponse.json({ collected: true }, { status: 202 });
}
