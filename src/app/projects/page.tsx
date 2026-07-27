import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MDX_REGEX } from "@/lib/const";

export const metadata: Metadata = {
	title: "Projects",
	openGraph: { images: ["/og/projects.png"] },
};

export default async function Page() {
	const directory = path.join(
		process.cwd(),
		"src",
		"app",
		"projects",
		"_projects"
	);
	const files = (await fs.readdir(directory)).filter((file) =>
		file.endsWith(".mdx")
	);
	const items = (
		await Promise.all(
			files.map(async (file) => {
				const module = await import(`./_projects/${file}`);
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
	items.sort((a, b) => Number(b.sort ?? 0) - Number(a.sort ?? 0));

	return (
		<div className="page-column">
			<header className="collection-header">
				<p className="content-eyebrow">Selected work</p>
				<h1>Projects</h1>
				<p>Systems, products, and research I have designed and built.</p>
			</header>
			<ul className="editorial-list">
				{items.map((item) => (
					<li key={item.slug}>
						<Link className="project-row" href={`/projects/${item.slug}`}>
							<span className="row-icon">
								<Image alt="" fill sizes="44px" src={item.image} />
							</span>
							<span className="row-identity">
								<strong>{item.title}</strong>
								<small>
									{item.company ?? item.tags?.slice(0, 2).join(" · ")}
								</small>
							</span>
							<span className="row-description">{item.description}</span>
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
