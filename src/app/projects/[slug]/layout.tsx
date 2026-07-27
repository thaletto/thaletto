import { ExternalLink } from "lucide-react";
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
	const { metadata } = await import(`../_projects/${slug}.mdx`);
	const [headings, neighbors] = await Promise.all([
		contentHeadings("projects", slug),
		collectionNeighbors("projects", slug),
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
					<p className="content-eyebrow">Project</p>
					<h1 className="content-title">{metadata.title}</h1>
					{metadata.description ? (
						<p className="content-description">{metadata.description}</p>
					) : null}
					<MetadataPlate
						items={[
							{ label: "Company", value: metadata.company },
							{ label: "Started", value: startDate },
							{ label: "Ended", value: endDate },
							{
								label: "Stack",
								value: metadata.tags?.join(" · "),
							},
						]}
					/>
					{metadata.links?.length ? (
						<div className="content-actions">
							{metadata.links.map((link: { label: string; url: string }) => (
								<a
									href={link.url}
									key={link.url}
									rel="noreferrer"
									target="_blank"
								>
									<ExternalLink aria-hidden />
									{link.label}
								</a>
							))}
						</div>
					) : null}
					<ContentCover
						alt={metadata.imageLabel ?? metadata.title}
						caption={metadata.imageLabel}
						height={metadata.imageHeight}
						src={metadata.image}
						width={metadata.imageWidth}
					/>
				</header>
				{children}
				<CollectionNavigation
					indexHref="/projects"
					indexLabel="All projects"
					next={neighbors.next}
					previous={neighbors.previous}
				/>
			</article>
		</>
	);
}
