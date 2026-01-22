"use server";
import { redis } from "@/lib/redis";

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
