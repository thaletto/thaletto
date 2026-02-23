import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
    redis?: ReturnType<typeof createClient>;
};

export const redis =
    globalForRedis.redis ??
    createClient({
        url: process.env.REDIS_URL,
    });

if (!globalForRedis.redis) {
    if (process.env.REDIS_URL) {
        redis.connect();
    }
    globalForRedis.redis = redis;
}
