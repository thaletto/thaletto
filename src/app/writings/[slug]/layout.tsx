import type { ReactNode } from "react";
import { ContentRail } from "@/components/content-rail";
import {
	CollectionNavigation,
	MetadataPlate,
} from "@/components/content-shell";
import { collectionNeighbors } from "@/lib/collections";
import { contentHeadings, contentStats } from "@/lib/content";

export default async function Layout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const { metadata } = await import(`../_articles/${slug}.mdx`);
	const [headings, stats, neighbors] = await Promise.all([
		contentHeadings("writings", slug),
		contentStats("writings", slug),
		collectionNeighbors("writings", slug),
	]);

	return (
		<>
			<ContentRail headings={headings} />
			<article className="content-article">
				<header className="content-header">
					<p className="content-eyebrow">Writing</p>
					<h1 className="content-title">{metadata.title}</h1>
					{metadata.description ? (
						<p className="content-description">{metadata.description}</p>
					) : null}
					<MetadataPlate
						items={[
							{ label: "Author", value: metadata.authors?.name },
							{ label: "Published", value: metadata.date },
							{ label: "Reading", value: `${stats.readingMinutes} min` },
							{ label: "Words", value: stats.words.toLocaleString("en-US") },
						]}
					/>
				</header>
				{children}
				<CollectionNavigation
					indexHref="/writings"
					indexLabel="All writings"
					next={neighbors.next}
					previous={neighbors.previous}
				/>
			</article>
		</>
	);
}
