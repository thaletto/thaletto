import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { MDX_REGEX } from "@/lib/const";
import { WritingsList } from "./page.client";

export const metadata: Metadata = {
	title: "Writings",
	openGraph: {
		images: ["/og/writings.png"],
	},
};

const articlesDirectory = path.join(
	process.cwd(),
	"src",
	"app",
	"writings",
	"_articles"
);

export interface WritingItem {
	date: string;
	description: string;
	slug: string;
	sort: number;
	title: string;
}

export default async function Page() {
	const articles = await fs.readdir(articlesDirectory);
	const articleFiles = articles.filter((f) => f.endsWith(".mdx"));

	const items = (
		await Promise.all(
			articleFiles.map(async (article) => {
				const module = await import(`./_articles/${article}`);
				if (!module.metadata) {
					throw new Error(`Missing \`metadata\` in ${article}`);
				}
				if (module.metadata.draft) return null;

				return {
					slug: article.replace(MDX_REGEX, ""),
					title: module.metadata.title,
					date: module.metadata.date || "-",
					sort: Number(module.metadata.date?.replaceAll(".", "") || 0),
					description: module.metadata?.description,
				};
			})
		)
	).filter((item): item is NonNullable<typeof item> => item !== null);

	items.sort((a, b) => b.sort - a.sort);

	return <WritingsList items={items} />;
}
