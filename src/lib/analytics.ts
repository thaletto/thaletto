import { createHash, createHmac } from "node:crypto";

export type DeviceClass = "desktop" | "mobile" | "tablet";

export interface ViewEvent {
	date: string;
	device: DeviceClass;
	pathname: string;
	referrerDomain: string;
	visitorKey: string;
}

export interface AnalyticsDimension {
	key: string;
	value: number;
}

export interface AnalyticsSummary {
	allTimeViews: number;
	daily: Array<{ date: string; uniqueVisitors: number; views: number }>;
	devices: AnalyticsDimension[];
	referrers: AnalyticsDimension[];
	routes: AnalyticsDimension[];
	uniqueVisitors: number;
	views: number;
}

export interface AnalyticsStore {
	record(event: ViewEvent): Promise<void>;
	summary(dates: string[]): Promise<AnalyticsSummary>;
}

interface RedisTransaction {
	exec(): Promise<unknown>;
	expire(key: string, seconds: number): RedisTransaction;
	hIncrBy(key: string, field: string, increment: number): RedisTransaction;
	incr(key: string): RedisTransaction;
	pfAdd(key: string, element: string): RedisTransaction;
}

interface RedisAnalyticsClient {
	get(key: string): Promise<string | null>;
	hGetAll(key: string): Promise<Record<string, string>>;
	multi(): RedisTransaction;
	pfCount(keys: string[]): Promise<number>;
	set(
		key: string,
		value: string,
		options: { EX: number; NX: true }
	): Promise<string | null>;
}

const AGGREGATE_TTL_SECONDS = 60 * 60 * 24 * 100;
const DEDUPE_TTL_SECONDS = 60 * 60 * 48;
const TABLET_USER_AGENT = /ipad|tablet|playbook|silk/i;
const MOBILE_USER_AGENT = /mobile|iphone|ipod|android/i;
const WWW_PREFIX = /^www\./;
const ALL_TIME_VIEWS_KEY = "views:global";

function sortDimensions(values: Map<string, number>): AnalyticsDimension[] {
	return [...values]
		.map(([key, value]) => ({ key, value }))
		.sort((a, b) => b.value - a.value || a.key.localeCompare(b.key));
}

function addDimensionMap(
	target: Map<string, number>,
	source: Map<string, number> | undefined
) {
	for (const [key, value] of source ?? []) {
		target.set(key, (target.get(key) ?? 0) + value);
	}
}

export async function recordView(store: AnalyticsStore, event: ViewEvent) {
	await store.record(event);
}

export function createMemoryAnalyticsStore(): AnalyticsStore {
	let allTimeViews = 0;
	const visitorsByDay = new Map<string, Set<string>>();
	const days = new Map<
		string,
		{
			devices: Map<string, number>;
			referrers: Map<string, number>;
			routes: Map<string, number>;
			uniqueVisitors: number;
			views: number;
		}
	>();

	return {
		record(event) {
			const day = days.get(event.date) ?? {
				devices: new Map(),
				referrers: new Map(),
				routes: new Map(),
				uniqueVisitors: 0,
				views: 0,
			};
			days.set(event.date, day);

			allTimeViews += 1;
			day.views += 1;
			day.devices.set(event.device, (day.devices.get(event.device) ?? 0) + 1);
			day.referrers.set(
				event.referrerDomain,
				(day.referrers.get(event.referrerDomain) ?? 0) + 1
			);
			day.routes.set(event.pathname, (day.routes.get(event.pathname) ?? 0) + 1);

			const visitors = visitorsByDay.get(event.date) ?? new Set<string>();
			visitorsByDay.set(event.date, visitors);
			if (!visitors.has(event.visitorKey)) {
				visitors.add(event.visitorKey);
				day.uniqueVisitors += 1;
			}
			return Promise.resolve();
		},
		summary(dates) {
			const devices = new Map<string, number>();
			const referrers = new Map<string, number>();
			const routes = new Map<string, number>();
			const uniqueVisitors = new Set<string>();
			let views = 0;

			const daily = dates.map((date) => {
				const day = days.get(date);
				const row = {
					date,
					uniqueVisitors: day?.uniqueVisitors ?? 0,
					views: day?.views ?? 0,
				};
				for (const visitor of visitorsByDay.get(date) ?? []) {
					uniqueVisitors.add(visitor);
				}
				views += row.views;

				addDimensionMap(devices, day?.devices);
				addDimensionMap(referrers, day?.referrers);
				addDimensionMap(routes, day?.routes);

				return row;
			});

			return Promise.resolve({
				allTimeViews,
				daily,
				devices: sortDimensions(devices),
				referrers: sortDimensions(referrers),
				routes: sortDimensions(routes),
				uniqueVisitors: uniqueVisitors.size,
				views,
			});
		},
	};
}

function dayKey(date: string) {
	return `analytics:day:${date}`;
}

function dimensionKey(
	dimension: "devices" | "referrers" | "routes",
	date: string
) {
	return `analytics:${dimension}:${date}`;
}

function uniqueVisitorsKey(date: string) {
	return `analytics:unique-visitors:${date}`;
}

function dailyDedupeKey(event: ViewEvent) {
	const opaqueVisitor = createHash("sha256")
		.update(`${event.date}:${event.visitorKey}`)
		.digest("hex");
	return `analytics:unique:${event.date}:${opaqueVisitor}`;
}

function addHash(target: Map<string, number>, hash: Record<string, string>) {
	for (const [key, rawValue] of Object.entries(hash)) {
		target.set(key, (target.get(key) ?? 0) + Number(rawValue));
	}
}

export function createRedisAnalyticsStore(
	client: RedisAnalyticsClient
): AnalyticsStore {
	return {
		async record(event) {
			const dedupeKey = dailyDedupeKey(event);
			const isUnique = await client.set(dedupeKey, "1", {
				EX: DEDUPE_TTL_SECONDS,
				NX: true,
			});
			const keys = [
				dayKey(event.date),
				dimensionKey("devices", event.date),
				dimensionKey("referrers", event.date),
				dimensionKey("routes", event.date),
				uniqueVisitorsKey(event.date),
			];
			const transaction = client
				.multi()
				.incr(ALL_TIME_VIEWS_KEY)
				.hIncrBy(dayKey(event.date), "views", 1)
				.hIncrBy(dimensionKey("devices", event.date), event.device, 1)
				.hIncrBy(dimensionKey("referrers", event.date), event.referrerDomain, 1)
				.hIncrBy(dimensionKey("routes", event.date), event.pathname, 1)
				.pfAdd(uniqueVisitorsKey(event.date), event.visitorKey);

			if (isUnique) {
				transaction.hIncrBy(dayKey(event.date), "uniqueVisitors", 1);
			}
			for (const key of keys) {
				transaction.expire(key, AGGREGATE_TTL_SECONDS);
			}
			await transaction.exec();
		},
		async summary(dates) {
			const devices = new Map<string, number>();
			const referrers = new Map<string, number>();
			const routes = new Map<string, number>();
			let views = 0;

			const daily = await Promise.all(
				dates.map(async (date) => {
					const [day, dayDevices, dayReferrers, dayRoutes] = await Promise.all([
						client.hGetAll(dayKey(date)),
						client.hGetAll(dimensionKey("devices", date)),
						client.hGetAll(dimensionKey("referrers", date)),
						client.hGetAll(dimensionKey("routes", date)),
					]);
					const row = {
						date,
						uniqueVisitors: Number(day.uniqueVisitors ?? 0),
						views: Number(day.views ?? 0),
					};
					views += row.views;
					addHash(devices, dayDevices);
					addHash(referrers, dayReferrers);
					addHash(routes, dayRoutes);
					return row;
				})
			);

			const uniqueVisitors = dates.length
				? await client.pfCount(dates.map(uniqueVisitorsKey))
				: 0;
			return {
				allTimeViews: Number((await client.get(ALL_TIME_VIEWS_KEY)) ?? 0),
				daily,
				devices: sortDimensions(devices),
				referrers: sortDimensions(referrers),
				routes: sortDimensions(routes),
				uniqueVisitors,
				views,
			};
		},
	};
}

export function dailyIpVisitorKey(ip: string, date: string, secret: string) {
	return `ip:${hashIdentifier(`${date}:${ip}`, secret)}`;
}

export function anonymousSessionVisitorKey(sessionId: string, secret: string) {
	return `session:${hashIdentifier(sessionId, secret)}`;
}

export function analyticsRateLimitKey(visitorKey: string, secret: string) {
	return `analytics:rate:${hashIdentifier(visitorKey, secret)}`;
}

function hashIdentifier(value: string, secret: string) {
	return createHmac("sha256", secret).update(value).digest("hex");
}

export function dateRange(days: number, now = new Date()) {
	return Array.from({ length: days }, (_, index) => {
		const date = new Date(now);
		date.setUTCDate(now.getUTCDate() - (days - index - 1));
		return date.toISOString().slice(0, 10);
	});
}

export function deviceClass(userAgent: string): DeviceClass {
	if (TABLET_USER_AGENT.test(userAgent)) {
		return "tablet";
	}
	if (MOBILE_USER_AGENT.test(userAgent)) {
		return "mobile";
	}
	return "desktop";
}

export function referrerDomain(referrer: string, siteOrigin: string) {
	if (!referrer) {
		return "direct";
	}
	try {
		const url = new URL(referrer);
		if (url.origin === siteOrigin) {
			return "internal";
		}
		return url.hostname.replace(WWW_PREFIX, "");
	} catch {
		return "direct";
	}
}
