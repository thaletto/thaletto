import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ContentKind } from "@/components/mdx/mdx-components";

const HEADING_SEPARATOR = /[^a-z0-9]+/g;
const EDGE_HYPHENS = /(^-|-$)/g;
const HEADINGS = /^(#{2,3})\s+(.+)$/gm;
const MARKDOWN_MARKS = /[`_*]/g;
const METADATA_EXPORT = /^export const metadata[\s\S]*?^};\s*/m;
const HTML_TAG = /<[^>]+>/g;
const PROSE_MARKS = /[`#*_[\](){}|>-]/g;
const WHITESPACE = /\s+/;

export interface ContentHeading {
	depth: 2 | 3;
	id: string;
	label: string;
}

export function slugifyHeading(label: string) {
	return label
		.toLowerCase()
		.replace(HEADING_SEPARATOR, "-")
		.replace(EDGE_HYPHENS, "");
}

export async function contentHeadings(kind: ContentKind, slug: string) {
	const folder = kind === "writings" ? "_articles" : `_${kind}`;
	const source = await readFile(
		path.join(process.cwd(), "src", "app", kind, folder, `${slug}.mdx`),
		"utf8"
	);
	const headings: ContentHeading[] = [];
	for (const match of source.matchAll(HEADINGS)) {
		const label = match[2].replace(MARKDOWN_MARKS, "").trim();
		headings.push({
			depth: match[1].length as 2 | 3,
			id: slugifyHeading(label),
			label,
		});
	}
	return headings;
}

export async function contentStats(kind: ContentKind, slug: string) {
	const folder = kind === "writings" ? "_articles" : `_${kind}`;
	const source = await readFile(
		path.join(process.cwd(), "src", "app", kind, folder, `${slug}.mdx`),
		"utf8"
	);
	const body = source.replace(METADATA_EXPORT, "");
	const words = body
		.replace(HTML_TAG, " ")
		.replace(PROSE_MARKS, " ")
		.trim()
		.split(WHITESPACE)
		.filter(Boolean).length;
	return { readingMinutes: Math.max(1, Math.ceil(words / 220)), words };
}
