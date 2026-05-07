import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { MDX_REGEX } from "@/lib/const";

export default async function Page(props: {
	params: Promise<{
		slug: string;
	}>;
}) {
	const params = await props.params;
	const { default: MDXContent } = await import(
		`../_projects/${params.slug}.mdx`
	);

	return <MDXContent />;
}

export async function generStaticParams() {
	const projects = await fs.readdir(
		path.join(process.cwd(), "src", "app", "projects", "_projects")
	);

	return projects
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
	const metadata = (await import(`../_projects/${params.slug}.mdx`)).metadata;
	return {
		title: metadata.title,
		description: metadata.description,
		openGraph: {
			images: [`/og/projects/${params.slug}.png`],
		},
	};
}
