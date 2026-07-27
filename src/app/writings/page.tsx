import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { MDX_REGEX } from "@/lib/const";

export const metadata: Metadata = {
	title: "Writings",
	openGraph: { images: ["/og/writings.png"] },
};

export default async function Page() {
	const directory = path.join(
		process.cwd(),
		"src",
		"app",
		"writings",
		"_articles"
	);
	const files = (await fs.readdir(directory)).filter((file) =>
		file.endsWith(".mdx")
	);
	const items = (
		await Promise.all(
			files.map(async (file) => {
				const module = await import(`./_articles/${file}`);
				if (!module.metadata || module.metadata.draft) {
					return null;
				}
				return {
					...module.metadata,
					slug: file.replace(MDX_REGEX, ""),
				};
			})
		)
	).filter((item): item is NonNullable<typeof item> => item !== null);
	items.sort((a, b) => String(b.date).localeCompare(String(a.date)));
	const groups = Map.groupBy(items, (item) => String(item.date).slice(0, 4));

	return (
		<div className="page-column">
			<header className="collection-header">
				<p className="content-eyebrow">Notes and essays</p>
				<h1>Writings</h1>
			</header>
			<div className="writing-groups">
				{[...groups].map(([year, writings]) => (
					<section aria-labelledby={`year-${year}`} key={year}>
						<h2 id={`year-${year}`}>{year}</h2>
						<ul className="writing-list">
							{writings.map((item) => (
								<li key={item.slug}>
									<Link href={`/writings/${item.slug}`}>
										<span>
											<strong>{item.title}</strong>
											<small>{item.description}</small>
										</span>
										<time>{String(item.date).slice(5)}</time>
									</Link>
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
		</div>
	);
}
