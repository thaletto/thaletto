import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-auth-server";
import { createRedisAnalyticsStore, dateRange } from "@/lib/analytics";
import { ensureRedis, redis } from "@/lib/redis";

const RANGES = new Map([
	["7d", 7],
	["30d", 30],
	["90d", 90],
]);

function Metric({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="admin-metric">
			<span>{label}</span>
			<strong>{value}</strong>
		</div>
	);
}

function Ranking({
	empty,
	items,
	title,
}: {
	empty: string;
	items: Array<{ key: string; value: number }>;
	title: string;
}) {
	return (
		<section className="admin-panel">
			<h2>{title}</h2>
			{items.length ? (
				<ol className="admin-ranking">
					{items.slice(0, 8).map((item) => (
						<li key={item.key}>
							<span>{item.key}</span>
							<strong>{item.value.toLocaleString("en-US")}</strong>
						</li>
					))}
				</ol>
			) : (
				<p className="admin-empty">{empty}</p>
			)}
		</section>
	);
}

export default async function AdminPage({
	searchParams,
}: {
	searchParams: Promise<{ range?: string }>;
}) {
	const owner = await requireAdminPage();
	const params = await searchParams;
	const range = RANGES.has(params.range ?? "")
		? (params.range ?? "30d")
		: "30d";
	const days = RANGES.get(range) ?? 30;
	const available = await ensureRedis();
	const summary = available
		? await createRedisAnalyticsStore(redis).summary(dateRange(days))
		: {
				allTimeViews: 0,
				daily: dateRange(days).map((date) => ({
					date,
					uniqueVisitors: 0,
					views: 0,
				})),
				devices: [],
				referrers: [],
				routes: [],
				uniqueVisitors: 0,
				views: 0,
			};
	const maxViews = Math.max(1, ...summary.daily.map((day) => day.views));

	return (
		<main className="admin-main">
			<header className="admin-header">
				<div>
					<p className="content-eyebrow">Owner console</p>
					<h1>Analytics</h1>
					<p>Signed in as @{owner.login}</p>
				</div>
				<div className="admin-actions">
					<Link href="/">
						<ArrowLeft aria-hidden />
						Site
					</Link>
					<form action="/api/auth/logout" method="post">
						<button type="submit">
							<LogOut aria-hidden />
							Sign out
						</button>
					</form>
				</div>
			</header>

			<nav aria-label="Analytics range" className="admin-ranges">
				{[...RANGES].map(([value, label]) => (
					<Link
						aria-current={range === value ? "page" : undefined}
						href={`/admin?range=${value}`}
						key={value}
					>
						{label} days
					</Link>
				))}
			</nav>

			<div className="admin-metrics">
				<Metric label="Views" value={summary.views.toLocaleString("en-US")} />
				<Metric
					label="Unique visitors"
					value={summary.uniqueVisitors.toLocaleString("en-US")}
				/>
				<Metric
					label="All-time views"
					value={summary.allTimeViews.toLocaleString("en-US")}
				/>
				<Metric
					label="Views per visitor"
					value={
						summary.uniqueVisitors
							? (summary.views / summary.uniqueVisitors).toFixed(1)
							: "0.0"
					}
				/>
			</div>

			<section className="admin-panel admin-trend">
				<div className="admin-panel-heading">
					<h2>Daily trend</h2>
					<span>{range}</span>
				</div>
				<div className="trend-bars">
					{summary.daily.map((day) => (
						<div
							aria-label={`${day.date}: ${day.views} views`}
							className="trend-column"
							key={day.date}
							role="img"
							title={`${day.date}: ${day.views} views`}
						>
							<span style={{ height: `${(day.views / maxViews) * 100}%` }} />
						</div>
					))}
				</div>
			</section>

			<div className="admin-grid">
				<Ranking
					empty="No routes yet"
					items={summary.routes}
					title="Top routes"
				/>
				<Ranking
					empty="No referrers yet"
					items={summary.referrers}
					title="Referring domains"
				/>
				<Ranking
					empty="No device data yet"
					items={summary.devices}
					title="Devices"
				/>
			</div>
		</main>
	);
}
