import { promises as fs } from "fs";
import path from "path";
import { TimelineLayout } from "@/components/timeline/timeline-layout";
import type { TimelineElement } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Timeline",
};

// Timeline directory
const timelineDirectory = path.join(
    process.cwd(),
    "app",
    "timeline",
    "_timeline",
);

function toSortableDate(value: string) {
    // Supports: YYYY, YYYY-MM, YYYY.MM
    const normalized = value.replace('.', '-');
    const date = new Date(normalized);

    return isNaN(date.getTime()) ? 0 : date.getTime();
}


export default async function Page() {
    const timelineFiles = await fs.readdir(timelineDirectory);

    const items: TimelineElement[] = [];

    for (const file of timelineFiles) {
        if (!file.endsWith('.mdx')) continue;

        const module = await import('./_timeline/' + file);

        if (!module.metadata)
            throw new Error('Missing `metadata` in ' + file);
        if (module.metadata.draft) continue;

        const startDate = module.metadata.startDate;
        const endDate = module.metadata.endDate ?? 'Present';

        items.push({
            id: items.length + 1,
            startDate,
            endDate,
            date: `${startDate} - ${endDate}`,
            title: module.metadata.title,
            description: module.metadata.description ?? '',
            content: module.metadata.content,
            image: module.metadata.image,
            slug: file.replace(/\.mdx$/, ''),
        });
    }

    items.sort(
        (a, b) =>
            toSortableDate(a.startDate) - toSortableDate(b.startDate),
    );

    return (
        <TimelineLayout
            items={items}
            size="lg"
            animate={true}
            className="max-w-6xl mx-auto"
        />
    );
}