import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DitheredImage } from "@/components/dithered-image";

export function MetadataPlate({
	items,
}: {
	items: Array<{ label: string; value?: React.ReactNode }>;
}) {
	const visible = items.filter((item) => item.value);
	if (visible.length === 0) {
		return null;
	}
	return (
		<dl className="metadata-plate">
			{visible.map((item) => (
				<div key={item.label}>
					<dt>{item.label}</dt>
					<dd>{item.value}</dd>
				</div>
			))}
		</dl>
	);
}

export function ContentCover({
	alt,
	caption,
	height,
	src,
	width,
}: {
	alt: string;
	caption?: string;
	height?: number;
	src?: string;
	width?: number;
}) {
	if (!src) {
		return null;
	}
	return (
		<DitheredImage
			alt={alt}
			caption={caption}
			className="content-cover"
			height={height ?? 675}
			priority
			src={src}
			width={width ?? 1200}
		/>
	);
}

export function CollectionNavigation({
	indexHref,
	indexLabel,
	next,
	previous,
}: {
	indexHref: string;
	indexLabel: string;
	next?: { href: string; label: string };
	previous?: { href: string; label: string };
}) {
	return (
		<nav aria-label="Collection navigation" className="collection-navigation">
			<div>
				{previous ? (
					<Link href={previous.href}>
						<ArrowLeft aria-hidden />
						<span>
							<small>Previous</small>
							{previous.label}
						</span>
					</Link>
				) : null}
			</div>
			<Link className="collection-index" href={indexHref}>
				{indexLabel}
			</Link>
			<div>
				{next ? (
					<Link href={next.href}>
						<span>
							<small>Next</small>
							{next.label}
						</span>
						<ArrowRight aria-hidden />
					</Link>
				) : null}
			</div>
		</nav>
	);
}
