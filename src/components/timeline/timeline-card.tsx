"use client";

import type React from "react";
import Image from "next/image";
import { NavLink } from "../nav-link";

interface TimelineCardProps {
	/** URL of the image to display in the card. */
	image: string;
	/** Optional title of the timeline event. */
	title?: string;
	/** Optional short description of the timeline event. */
	description?: string;
	/** Optional detailed content or custom nodes to render in the card. */
	content?: React.ReactNode;
	/** Optional URL slug for navigating to a detailed timeline page. */
	slug?: string;
}

/**
 * TimelineCard renders a card for a timeline item.
 * It displays an image, a title, a description, and optional details.
 * If a `slug` is provided, the card is wrapped in a `NavLink` to enable navigation.
 *
 * @param {TimelineCardProps} props - The component props.
 * @returns {React.JSX.Element} The rendered timeline card component.
 */
export function TimelineCard({
	image,
	title,
	description,
	content,
	slug,
}: TimelineCardProps): React.JSX.Element {
	const cardContent = (
		<div className="w-full max-w-sm rotate-1 bg-card p-3 text-card-foreground shadow-lg transition-transform duration-300 group-hover/item:rotate-0">
			<div className="relative h-48 w-full">
				<Image
					alt={title ?? ""}
					className="object-cover"
					fill
					src={image}
					sizes="(max-width: 768px) 100vw, 400px"
				/>
			</div>

			<div className="mt-3 text-center">
				{title && (
					<p className="font-bold font-serif text-base text-foreground">
						{title}
					</p>
				)}

				{description && (
					<p className="mt-1 text-muted-foreground text-sm">{description}</p>
				)}

				{content && (
					<div className="mt-2 whitespace-pre-line border-border border-t pt-2 text-muted-foreground text-xs">
						{content}
					</div>
				)}
			</div>
		</div>
	);

	if (!slug) {
		return cardContent;
	}

	return (
		<NavLink className="block" href={`/timeline/${slug}`}>
			{cardContent}
		</NavLink>
	);
}
