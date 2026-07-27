import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth-server";
import { createRedisAnalyticsStore, dateRange } from "@/lib/analytics";
import { ensureRedis, redis } from "@/lib/redis";

const RANGES = new Map([
	["7d", 7],
	["30d", 30],
	["90d", 90],
]);

export async function GET(request: Request) {
	if (!(await getAdminSession())) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	if (!(await ensureRedis())) {
		return NextResponse.json({ error: "Redis unavailable" }, { status: 503 });
	}
	const range = new URL(request.url).searchParams.get("range") ?? "30d";
	const days = RANGES.get(range);
	if (!days) {
		return NextResponse.json({ error: "Invalid range" }, { status: 400 });
	}
	const summary = await createRedisAnalyticsStore(redis).summary(
		dateRange(days)
	);
	return NextResponse.json(summary);
}
