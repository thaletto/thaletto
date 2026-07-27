import type { ReactNode } from "react";
import { ContentRail } from "@/components/content-rail";
import {
	CollectionNavigation,
	ContentCover,
	MetadataPlate,
} from "@/components/content-shell";
import { collectionNeighbors } from "@/lib/collections";
import { contentHeadings } from "@/lib/content";
import { formatDate } from "@/lib/date";

export default async function Layout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const { metadata } = await import(`../_timeline/${slug}.mdx`);
	const [headings, neighbors] = await Promise.all([
		contentHeadings("timeline", slug),
		collectionNeighbors("timeline", slug),
	]);
	const startDate = formatDate(metadata.startDate, "MMMYYYY");
	const endDate = metadata.endDate
		? formatDate(metadata.endDate, "MMMYYYY")
		: "Present";

	return (
		<>
			<ContentRail headings={headings} />
			<article className="content-article">
				<header className="content-header">
					<p className="content-eyebrow">Timeline</p>
					<h1 className="content-title">{metadata.title}</h1>
					<MetadataPlate
						items={[
							{ label: "Started", value: startDate },
							{ label: "Ended", value: endDate },
							{ label: "Summary", value: metadata.content },
						]}
					/>
					<ContentCover
						alt={metadata.title}
						height={metadata.imageHeight}
						src={metadata.image}
						width={metadata.imageWidth}
					/>
				</header>
				{children}
				<CollectionNavigation
					indexHref="/timeline"
					indexLabel="All timeline"
					next={neighbors.next}
					previous={neighbors.previous}
				/>
			</article>
		</>
	);
}
