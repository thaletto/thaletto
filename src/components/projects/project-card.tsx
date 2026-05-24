"use client";

import type React from "react";
import { NavLink } from "../nav-link";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
    /** URL of the image to display in the card. */
    image: string;
    /** Title of the project. */
    title: string;
    /** Start date of the project (e.g., "2024.07"). */
    startDate: string;
    /** End date of the project (e.g., "2024.09" or "Present"). */
    endDate?: string;
    /** Optional tags of the project. */
    tags?: string[];
    /** Optional URL slug for navigating to a detailed project page. */
    slug?: string;
    /** Optional detailed content or custom nodes to render in the card. */
    content?: React.ReactNode;
    /** Optional additional CSS classes for custom styling. */
    className?: string;
}

/**
 * ProjectCard renders a card for a project.
 * It displays an image, a title, dates, tags, and optional details.
 * If a `slug` is provided, the card is wrapped in a `NavLink` to enable navigation.
 *
 * @param {ProjectCardProps} props - The component props.
 * @returns {React.JSX.Element} The rendered project card component.
 */
export default function ProjectCard({
    image,
    title,
    startDate,
    endDate,
    tags = [],
    slug,
    content,
    className,
}: ProjectCardProps): React.JSX.Element {
    const start = formatDate(startDate, "MMMYYYY");
    const end = endDate ? formatDate(endDate, "MMMYYYY") : "Present";

    const cardContent = (
        <div
            className={`${cn(
                "w-85 max-w-full rounded-xl border border-border bg-card p-3 text-card-foreground shadow-lg transition-transform duration-300",
            )} hover:rotate-0 group-hover/item:rotate-0 ${className ?? ""}`}
        >
            <img
                alt={title}
                className="h-48 w-full object-cover rounded-lg"
                height="12rem"
                src={image}
                width="100%"
            />

            <div className="mt-3 text-center">
                <p className="font-bold font-serif text-base text-foreground">
                    {title}
                </p>

                <p className="mt-1 text-muted-foreground text-sm">
                    {start} &rarr; {end}
                </p>

                {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                        {tags.map((tag) => (
                            <Badge
                                className="rounded-sm px-1.5 py-0.5 text-xs"
                                key={tag}
                                variant="secondary"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
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
        <NavLink className="block" href={`/projects/${slug}`}>
            {cardContent}
        </NavLink>
    );
}
