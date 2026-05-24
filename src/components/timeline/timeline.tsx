"use client";

import type React from "react";
import { cn } from "@/lib/utils";

export { TimelineItem } from "./timeline-item";

interface TimelineProps {
	/** Children elements (typically TimelineItem components) to render inside the timeline container. */
	children: React.ReactNode;
	/** Optional additional CSS classes for custom styling. */
	className?: string;
}

/**
 * Timeline component acts as a container for rendering an ordered list of
 * timeline events or items.
 *
 * @param {TimelineProps} props - The component props.
 * @returns {React.JSX.Element} The rendered timeline container.
 */
export function Timeline({
	children,
	className,
}: TimelineProps): React.JSX.Element {
	if (!children) {
		return (
			<p className="py-8 text-center text-muted-foreground text-sm">
				No timeline items
			</p>
		);
	}

	return (
		<ol
			aria-label="Timeline"
			className={cn("relative mx-auto flex max-w-2xl flex-col py-8", className)}
		>
			{children}
		</ol>
	);
}
