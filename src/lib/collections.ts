import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ContentKind } from "@/components/mdx/mdx-components";
import { MDX_REGEX } from "@/lib/const";

interface CollectionItem {
	href: string;
	label: string;
	slug: string;
	sort: number;
}

function collectionSort(kind: ContentKind, metadata: Record<string, unknown>) {
	let value: unknown;
	if (kind === "writings") {
		value = metadata.date;
	} else if (kind === "timeline") {
		value = metadata.startDate;
	} else {
		value = metadata.sort;
	}
	return typeof value === "string" ? value.replaceAll(".", "") : value;
}

export async function collectionNeighbors(
	kind: ContentKind,
	currentSlug: string
) {
	const folder = kind === "writings" ? "_articles" : `_${kind}`;
	const directory = path.join(process.cwd(), "src", "app", kind, folder);
	const files = (await readdir(directory)).filter((file) =>
		file.endsWith(".mdx")
	);
	const items = (
		await Promise.all(
			files.map(async (file): Promise<CollectionItem | null> => {
				const slug = file.replace(MDX_REGEX, "");
				const module = await import(`@/app/${kind}/${folder}/${file}`);
				if (!module.metadata || module.metadata.draft) {
					return null;
				}
				const rawSort = collectionSort(kind, module.metadata);
				return {
					href: `/${kind}/${slug}`,
					label: module.metadata.title,
					slug,
					sort: Number(rawSort ?? 0),
				};
			})
		)
	).filter((item): item is CollectionItem => item !== null);
	items.sort((a, b) => b.sort - a.sort);
	const index = items.findIndex((item) => item.slug === currentSlug);
	if (index < 0 || items.length < 2) {
		return {};
	}
	return {
		next: items[(index - 1 + items.length) % items.length],
		previous: items[(index + 1) % items.length],
	};
}
