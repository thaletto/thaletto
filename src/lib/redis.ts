import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
	redisConnection?: Promise<unknown>;
	redis?: ReturnType<typeof createClient>;
};

export const redis =
	globalForRedis.redis ??
	createClient({
		url: process.env.REDIS_URL,
	});

if (!globalForRedis.redis) {
	globalForRedis.redis = redis;
}

export async function ensureRedis() {
	if (!process.env.REDIS_URL) {
		return false;
	}
	if (redis.isReady) {
		return true;
	}
	if (globalForRedis.redisConnection) {
		await globalForRedis.redisConnection;
		return redis.isReady;
	}
	if (redis.isOpen) {
		return false;
	}
	globalForRedis.redisConnection = redis.connect().finally(() => {
		globalForRedis.redisConnection = undefined;
	});
	await globalForRedis.redisConnection;
	return redis.isReady;
}
