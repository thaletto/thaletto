"use server";
import { unstable_cache as cache } from "next/cache";
import { ensureRedis, redis } from "@/lib/redis";

export async function incrementGlobalView(sessionId: string) {
	if (process.env.NODE_ENV !== "production") {
		return;
	}
	if (!(await ensureRedis())) {
		return;
	}

	const dedupeKey = `viewed:global:${sessionId}`;
	const alreadyViewed = await redis.get(dedupeKey);

	if (alreadyViewed) {
		return;
	}

	// Atomic increment + mark session as counted
	await redis
		.multi()
		.set(dedupeKey, 1, { EX: 60 * 60 * 24 }) // 24h dedupe
		.incr("views:global")
		.exec();
}

interface ContributionsResponse {
	contributions: { date: string; count: number; level: number }[];
	total: Record<string, number>;
}

const GITHUB_USERNAME = "thaletto";

export const getContributionsData = cache(
	async () => {
		const url = new URL(
			`/v4/${GITHUB_USERNAME}`,
			"https://github-contributions-api.jogruber.de"
		);
		let data: ContributionsResponse;
		try {
			const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
			if (!response.ok) {
				throw new Error(`GitHub contributions returned ${response.status}`);
			}
			data = (await response.json()) as ContributionsResponse;
		} catch {
			return { contributions: [], total: {} };
		}
		const total = data.total;
		const [today] = new Date().toISOString().split("T");
		const [oneYearAgo] = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T");
		const contributions = data.contributions.filter(
			(c) => c.date >= oneYearAgo && c.date <= today
		);
		return { contributions, total };
	},
	["github-contributions"],
	{ revalidate: 60 * 60 * 24 }
);
