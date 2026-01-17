import { Badge } from "@/components/ui/badge";
import { promises as fs } from "fs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import path from "path";

export const metadata: Metadata = {
    title: "Projects",
};

// In the future we can have a pagination here e.g. /1/*.mdx
const projectsDirectory = path.join(
    process.cwd(),
    "app",
    "projects",
    "_projects",
);

type ProjectListItemProps = {
    slug: string;
    title: string;
    date: string;
    tags?: string[];
};

export function ProjectListItem({
    slug,
    title,
    date,
    tags = [],
}: ProjectListItemProps) {
    return (
        <li className="font-medium my-4">
            <Link
                href={`/projects/${slug}`}
                className="group flex items-start gap-3 -mx-2 px-2 focus-visible:outline focus-visible:outline-rurikon-400 focus-visible:rounded-xs focus-visible:outline-dotted"
                draggable={false}
            >

                {/* Content */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    {/* Title + Dot leaders + Date */}
                    <div className="flex items-baseline gap-2 min-w-0">
                        <span className="text-rurikon-500 group-hover:text-rurikon-700 truncate">
                            {title}
                        </span>

                        <span className="dot-leaders flex-1 text-rurikon-100 group-hover:text-rurikon-500 transition-colors" />

                        <time className="text-sm tabular-nums text-rurikon-300 font-normal tracking-tighter whitespace-nowrap group-hover:text-rurikon-500">
                            {date}
                        </time>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="ghost"
                                    className="text-xs px-2 py-0.5 rounded-sm border border-rurikon-100 text-rurikon-300 group-hover:border-rurikon-500 group-hover:text-rurikon-500"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
        </li>
    );
}

export default async function Page() {
    const projects = await fs.readdir(projectsDirectory);

    const items: {
        slug: string;
        title: string;
        date: string;
        sort: number;
        tags?: string[];
    }[] = [];

    for (const project of projects) {
        if (!project.endsWith(".mdx")) continue;

        const module = await import("./_projects/" + project);

        if (!module.metadata)
            throw new Error("Missing `metadata` in " + project);
        if (module.metadata.draft) continue;

        items.push({
            slug: project.replace(/\.mdx$/, ""),
            title: module.metadata.title,
            date: module.metadata.endDate || "Present",
            sort: Number(module.metadata.endDate?.replaceAll(".", "") || 0),
            tags: module.metadata.tags ?? [],
        });
    }

    items.sort((a, b) => b.sort - a.sort);

    return (
        <div>
            <ul>
                {items.map((item) => (
                    <ProjectListItem
                        key={item.slug}
                        slug={item.slug}
                        title={item.title}
                        date={item.date}
                        tags={item.tags}
                    />
                ))}
            </ul>
        </div>
    );
}
