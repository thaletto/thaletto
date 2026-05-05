import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { MDX_REGEX } from "@/lib/const";

export default async function Page(props: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await props.params;

	const { default: MDXContent } = await import(`../_articles/${slug}.mdx`);

	return <MDXContent />;
}

export async function generateStaticParams() {
	const articles = await fs.readdir(
		path.join(process.cwd(), "app", "writings", "_articles")
	);

	return articles
		.filter((name) => name.endsWith(".mdx"))
		.map((name) => ({
			params: {
				slug: name.replace(MDX_REGEX, ""),
			},
		}));
}

export async function generateMetadata(props: {
	params: Promise<{
		slug: string;
	}>;
}): Promise<Metadata> {
	const params = await props.params;
	const metadata = (await import(`../_articles/${params.slug}.mdx`)).metadata;
	return {
		title: metadata.title,
		description: metadata.description,
		openGraph: {
			images: [`/og/writings/${params.slug}.png`],
		},
	};
}
