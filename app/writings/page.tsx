import { promises as fs } from "fs";
import { Metadata } from "next";
import Link from "next/link";
import path from "path";

export const metadata: Metadata = {
	title: "Writings",
};

// In the future we can have a pagination here e.g. /1/*.mdx
const articlesDirectory = path.join(
	process.cwd(),
	"app",
	"writings",
	"_articles",
);

export default async function Page() {
	const articles = await fs.readdir(articlesDirectory);

	const items = [];
	for (const article of articles) {
		if (!article.endsWith(".mdx")) continue;
		const module = await import("./_articles/" + article);

		if (!module.metadata) throw new Error("Missing `metadata` in " + article);
		if (module.metadata.draft) continue;

		items.push({
			slug: article.replace(/\.mdx$/, ""),
			title: module.metadata.title,
			date: module.metadata.date || "-",
			sort: Number(module.metadata.date?.replaceAll(".", "") || 0),
			description: module.metadata?.description,
		});
	}
	items.sort((a, b) => b.sort - a.sort);

	return (
		<div>
			<ul className="flex flex-col gap-y-8 [&>*:first-child]:mt-0 mt-0">
				{items.map((item) => (
					<li key={item.slug} className="font-medium">
						<Link
							href={`/writings/${item.slug}`}
							draggable={false}
							className="flex flex-col items-start gap-2"
						>
							<div className="flex flex-row w-full justify-between focus-visible:outline focus-visible:outline-ring focus-visible:rounded-xs focus-visible:outline-dotted">
								<h1 className="font-semibold text-base md:text-xl text-balance">
									{item.title}
								</h1>
								<time className="font-normal text-muted-foreground text-balance">
									{item.date}
								</time>
							</div>

							{item.description && (
								<p className="font-normal text-muted-foreground">
									{item.description}
								</p>
							)}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
