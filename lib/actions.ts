"use server";
import { redis } from "@/lib/redis";
import { unstable_cache as cache } from "next/cache";

export async function incrementGlobalView(sessionId: string) {
  if (process.env.NODE_ENV !== "production") return;

  const dedupeKey = `viewed:global:${sessionId}`;
  const alreadyViewed = await redis.get(dedupeKey);

  if (alreadyViewed) return;

  // Atomic increment + mark session as counted
  await redis
    .multi()
    .set(dedupeKey, 1, { EX: 60 * 60 * 24 }) // 24h dedupe
    .incr("views:global")
    .exec();
}

interface ContributionsResponse {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
}

const GITHUB_USERNAME = "thaletto";

export const getContributionsData = cache(
  async () => {
    const url = new URL(
      `/v4/${GITHUB_USERNAME}`,
      "https://github-contributions-api.jogruber.de",
    );
    const response = await fetch(url);
    const data = (await response.json()) as ContributionsResponse;
    const total = data.total;
    const [today] = new Date().toISOString().split("T");
    const [oneYearAgo] = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T");
    const contributions = data.contributions.filter(
      (c) => c.date >= oneYearAgo && c.date <= today,
    );
    return { contributions, total };
  },
  ["github-contributions"],
  { revalidate: 60 * 60 * 24 },
);
