import { describe, expect, test } from "bun:test";
import {
	anonymousSessionVisitorKey,
	createMemoryAnalyticsStore,
	dailyIpVisitorKey,
	recordView,
	type ViewEvent,
} from "@/lib/analytics";

const event: ViewEvent = {
	date: "2026-07-27",
	device: "desktop",
	pathname: "/writings/the-great-pyramid-of-JS",
	referrerDomain: "github.com",
	visitorKey: "session:visitor-1",
};

describe("recordView", () => {
	test("counts every view and deduplicates the daily visitor", async () => {
		const store = createMemoryAnalyticsStore();

		await recordView(store, event);
		await recordView(store, event);

		expect(await store.summary(["2026-07-27"])).toEqual({
			allTimeViews: 2,
			daily: [{ date: "2026-07-27", uniqueVisitors: 1, views: 2 }],
			devices: [{ key: "desktop", value: 2 }],
			referrers: [{ key: "github.com", value: 2 }],
			routes: [{ key: "/writings/the-great-pyramid-of-JS", value: 2 }],
			uniqueVisitors: 1,
			views: 2,
		});
	});

	test("deduplicates a returning cookie visitor across a summary range", async () => {
		const store = createMemoryAnalyticsStore();

		await recordView(store, event);
		await recordView(store, { ...event, date: "2026-07-28" });

		const summary = await store.summary(["2026-07-27", "2026-07-28"]);

		expect(summary.views).toBe(2);
		expect(summary.uniqueVisitors).toBe(1);
		expect(summary.daily.map((day) => day.uniqueVisitors)).toEqual([1, 1]);
	});
});

describe("anonymous visitor keys", () => {
	test("hashes both cookie and IP identifiers without retaining their source", () => {
		const sessionId = "private-session-id";
		const ip = "203.0.113.12";
		const secret = "analytics-secret";
		const date = "2026-07-27";

		const sessionKey = anonymousSessionVisitorKey(sessionId, secret);
		const ipKey = dailyIpVisitorKey(ip, date, secret);

		expect(sessionKey).toStartWith("session:");
		expect(ipKey).toStartWith("ip:");
		expect(sessionKey).not.toContain(sessionId);
		expect(ipKey).not.toContain(ip);
		expect(dailyIpVisitorKey(ip, "2026-07-28", secret)).not.toBe(ipKey);
	});
});
