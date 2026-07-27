import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MDX_REGEX } from "@/lib/const";

export const metadata: Metadata = {
	title: "Timeline",
	openGraph: { images: ["/og/timeline.png"] },
};

export default async function Page() {
	const directory = path.join(
		process.cwd(),
		"src",
		"app",
		"timeline",
		"_timeline"
	);
	const files = (await fs.readdir(directory)).filter((file) =>
		file.endsWith(".mdx")
	);
	const items = (
		await Promise.all(
			files.map(async (file) => {
				const module = await import(`./_timeline/${file}`);
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
	items.sort((a, b) => String(b.startDate).localeCompare(String(a.startDate)));

	return (
		<div className="page-column">
			<header className="collection-header">
				<p className="content-eyebrow">Experience</p>
				<h1>Timeline</h1>
				<p>Work, education, and the milestones between them.</p>
			</header>
			<ul className="editorial-list">
				{items.map((item) => (
					<li key={item.slug}>
						<Link className="experience-row" href={`/timeline/${item.slug}`}>
							<span className="row-icon">
								<Image alt="" fill sizes="44px" src={item.image} />
							</span>
							<span className="row-identity">
								<strong>{item.title}</strong>
								<small className="whitespace-pre-line">{item.content}</small>
							</span>
							<span className="row-date">
								{item.startDate}—{item.endDate ?? "now"}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
