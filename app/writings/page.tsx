import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { NavLink } from "@/components/nav-link";
import { MDX_REGEX } from "@/lib/const";

export const metadata: Metadata = {
	title: "Writings",
};

// In the future we can have a pagination here e.g. /1/*.mdx
const articlesDirectory = path.join(
	process.cwd(),
	"app",
	"writings",
	"_articles"
);

interface Item {
	date: string;
	description: string;
	slug: string;
	sort: number;
	title: string;
}

export default async function Page() {
	const articles = await fs.readdir(articlesDirectory);

	const items: Item[] = [];
	for (const article of articles) {
		if (!article.endsWith(".mdx")) {
			continue;
		}
		const module = await import(`./_articles/${article}`);

		if (!module.metadata) {
			throw new Error(`Missing \`metadata\` in ${article}`);
		}
		if (module.metadata.draft) {
			continue;
		}

		items.push({
			slug: article.replace(MDX_REGEX, ""),
			title: module.metadata.title,
			date: module.metadata.date || "-",
			sort: Number(module.metadata.date?.replaceAll(".", "") || 0),
			description: module.metadata?.description,
		});
	}
	items.sort((a, b) => b.sort - a.sort);

	return (
		<div>
			<ul className="mt-0 flex flex-col gap-y-8 [&>*:first-child]:mt-0">
				{items.map((item) => (
					<li className="font-medium" key={item.slug}>
						<NavLink
							className="flex flex-col items-start gap-2"
							href={`/writings/${item.slug}`}
						>
							<div className="flex w-full flex-row justify-between focus-visible:rounded-xs focus-visible:outline focus-visible:outline-dotted focus-visible:outline-ring">
								<h1 className="text-balance font-semibold text-base md:text-xl">
									{item.title}
								</h1>
								<time className="text-balance font-normal text-muted-foreground">
									{item.date}
								</time>
							</div>

							{item.description && (
								<p className="font-normal text-muted-foreground">
									{item.description}
								</p>
							)}
						</NavLink>
					</li>
				))}
			</ul>
		</div>
	);
}
