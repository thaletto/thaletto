"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useMemo } from "react";

/* ---------------------------------------------
 * Config
 * -------------------------------------------- */
const PIXELS_PER_MONTH = 10;
const MIN_DURATION_HEIGHT = 150;
const MIN_GAP_HEIGHT = 48; // Minimum space between items

/* ---------------------------------------------
 * Helpers
 * -------------------------------------------- */
const parseDate = (dateStr?: string) => {
    if (!dateStr || dateStr === "Present") return new Date();
    const parts = dateStr.split(".");
    if (parts.length === 2)
        return new Date(Number(parts[0]), Number(parts[1]) - 1);
    if (parts.length === 3)
        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2]),
        );
    return new Date(dateStr);
};

const calculateMonthDiff = (start?: string, end?: string) => {
    try {
        const s = parseDate(start);
        const e = parseDate(end);
        const diff =
            (e.getFullYear() - s.getFullYear()) * 12 +
            (e.getMonth() - s.getMonth());
        return Math.max(diff, 0);
    } catch {
        return 0;
    }
};

/* ---------------------------------------------
 * Timeline
 * -------------------------------------------- */
export function Timeline({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    if (!children) {
        return (
            <p className="py-8 text-center text-sm text-muted-foreground">
                No timeline items
            </p>
        );
    }

    return (
        <ol
            aria-label="Timeline"
            className={cn(
                "relative mx-auto flex max-w-2xl flex-col py-8",
                className,
            )}
        >
            {children}
        </ol>
    );
}

/* ---------------------------------------------
 * TimelineItem
 * -------------------------------------------- */
type Status = "completed" | "in-progress" | "pending";

export function TimelineItem({
    startDate,
    endDate,
    nextEndDate,
    title,
    description,
    content,
    image,
    slug,
    status = "completed",
    showConnector = true,
}: {
    startDate?: string;
    endDate?: string;
    nextEndDate?: string;
    title?: string;
    description?: string;
    content?: React.ReactNode;
    image?: string;
    slug?: string;
    status?: Status;
    showConnector?: boolean;
}) {
    const isMobile = useIsMobile();

    // Calculate heights
    const { durationHeight, gapHeight } = useMemo(() => {
        // Height of the job duration
        const durationMonths = calculateMonthDiff(startDate, endDate);
        const dHeight = Math.max(
            durationMonths * PIXELS_PER_MONTH,
            MIN_DURATION_HEIGHT,
        );

        // Height of the gap to the next job
        let gHeight = MIN_GAP_HEIGHT;
        if (nextEndDate && startDate) {
            const gapMonths = calculateMonthDiff(nextEndDate, startDate);
            gHeight = Math.max(gapMonths * PIXELS_PER_MONTH, MIN_GAP_HEIGHT);
        }

        return { durationHeight: dHeight, gapHeight: gHeight };
    }, [startDate, endDate, nextEndDate]);

    const formattedStartDate = startDate
        ? formatDate(parseDate(startDate), "MMMYYYY")
        : "";
    const formattedEndDate =
        endDate === "Present"
            ? "Present"
            : endDate
              ? formatDate(parseDate(endDate), "MMMYYYY")
              : "";

    return (
        <li
            className={cn(
                "group/item relative grid gap-6 last:pb-0",
                isMobile
                    ? "grid-cols-[24px_1fr]"
                    : "grid-cols-[120px_24px_1fr]",
            )}
            style={{
                minHeight: `${durationHeight}px`,
                marginBottom: showConnector ? `${gapHeight}px` : "0px",
            }}
        >
            {/* Date Column (Desktop) */}
            {!isMobile && (
                <div className="flex flex-col justify-between py-1 text-right">
                    <time className="text-xl font-bold leading-none">
                        {formattedEndDate}
                    </time>
                    <time className="text-xl font-bold leading-none">
                        {formattedStartDate}
                    </time>
                </div>
            )}

            {/* Connector Column */}
            <div className="relative flex flex-col items-center">
                {/* Internal Line (Duration) - Changes color on hover */}
                <span
                    className={cn(
                        "absolute top-2 bottom-2 left-1/2 w-0.5 -translate-x-1/2 bg-rurikon-200 transition-colors duration-300 group-hover/item:bg-rurikon-500",
                    )}
                />

                {/* Gap Line (Connector) - Stays same color */}
                {showConnector && (
                    <span
                        className="absolute left-1/2 w-0.5 -translate-x-1/2 bg-rurikon-200"
                        style={{
                            top: "calc(100% - 8px)",
                            height: `${gapHeight + 16}px`,
                        }}
                    />
                )}

                {/* Top Dot (End Date) */}
                <TimelineDot status={status} />

                {/* Bottom Dot (Start Date) */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <TimelineDot status="completed" />
                </div>
            </div>

            {/* Content Column */}
            <div
                className={cn(
                    "flex flex-col",
                    isMobile ? "justify-between h-full" : "justify-center",
                )}
            >
                {isMobile && (
                    <time className="mb-4 text-xl font-bold leading-none">
                        {formattedEndDate}
                    </time>
                )}

                {image ? (
                    <TimelineImage
                        image={image}
                        title={title}
                        description={description}
                        content={content}
                        slug={slug}
                    />
                ) : (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold leading-tight">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-base text-muted-foreground">
                                {description}
                            </p>
                        )}
                        {content && (
                            <div className="text-sm text-muted-foreground whitespace-pre-line">
                                {content}
                            </div>
                        )}
                    </div>
                )}

                {isMobile && (
                    <time className="mt-4 text-xl font-bold leading-none">
                        {formattedStartDate}
                    </time>
                )}
            </div>
        </li>
    );
}

/* ---------------------------------------------
 * TimelineDot
 * -------------------------------------------- */
function TimelineDot({ status }: { status: Status }) {
    return (
        <span
            className={cn(
                "relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-rurikon-500",
            )}
        />
    );
}

/* ---------------------------------------------
 * TimelineImage (Polaroid-style)
 * -------------------------------------------- */
function TimelineImage({
    image,
    title,
    description,
    content,
    slug,
}: {
    image: string;
    title?: string;
    description?: string;
    content?: React.ReactNode;
    slug?: string;
}) {
    const cardContent = (
        <div className="w-full max-w-sm rotate-1 bg-white p-3 shadow-lg transition-transform duration-300 group-hover/item:rotate-0">
            <img src={image} alt={title} className="h-48 w-full object-cover" />
            <div className="mt-3 text-center">
                {title && (
                    <p className="font-serif text-base font-bold text-gray-900">
                        {title}
                    </p>
                )}
                {description && (
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                )}
                {content && (
                    <div className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-600 whitespace-pre-line">
                        {content}
                    </div>
                )}
            </div>
        </div>
    );

    if (!slug) return cardContent;

    return (
        <Link href={`/timeline/${slug}`} className="block">
            {cardContent}
        </Link>
    );
}
