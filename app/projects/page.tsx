import SvgIcon from "@/components/common/logo";
import { Badge } from "@/components/ui/badge";
import { getCompanyLogoSrc } from "@/lib/utils";
import { promises as fs } from "fs";
import { Metadata } from "next";
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
  tags?: string[];
  company?: string;
  description?: string;
};

export function ProjectListItem({
  slug,
  title,
  tags = [],
  company,
  description,
}: ProjectListItemProps) {
  const companyIcon = getCompanyLogoSrc(company);

  return (
    <li className="font-medium my-4">
      <Link
        href={`/projects/${slug}`}
        className="group flex items-start -mx-2 px-2 focus-visible:outline focus-visible:outline-ring focus-visible:rounded-xs focus-visible:outline-dotted"
        draggable={false}
      >
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {companyIcon && (
              <SvgIcon
                src={companyIcon}
                name={company ?? ""}
                className="size-6 shrink-0"
              />
            )}

            <h1 className="font-semibold text-base md:text-xl text-balance">
              {title}
            </h1>
          </div>

          <p className="font-normal">{description}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="ghost"
                  className="text-xs px-2 py-0.5 rounded-sm border text-muted-foreground"
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
    sort: number;
    tags?: string[];
    company: string;
    description?: string;
  }[] = [];

  for (const project of projects) {
    if (!project.endsWith(".mdx")) continue;

    const module = await import("./_projects/" + project);

    if (!module.metadata) throw new Error("Missing `metadata` in " + project);
    if (module.metadata.draft) continue;

    items.push({
      slug: project.replace(/\.mdx$/, ""),
      title: module.metadata.title,
      sort: Number(module.metadata.sort || 0),
      tags: module.metadata.tags ?? [],
      company: module.metadata.company,
      description: module.metadata.description,
    });
  }

  items.sort((a, b) => b.sort - a.sort);

  return (
    <div>
      <ul className="flex flex-col gap-y-8 [&>*:first-child]:mt-0 mt-0">
        {items.map((item) => (
          <ProjectListItem
            key={item.slug}
            slug={item.slug}
            title={item.title}
            tags={item.tags}
            company={item.company}
            description={item.description}
          />
        ))}
      </ul>
    </div>
  );
}
