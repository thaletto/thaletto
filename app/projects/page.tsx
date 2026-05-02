import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import SvgIcon from "@/components/common/logo";
import { NavLink } from "@/components/nav-link";
import { Badge } from "@/components/ui/badge";
import { MDX_REGEX } from "@/lib/const";
import { getCompanyLogoSrc } from "@/lib/utils";
import { formatDate } from "@/lib/date";

export const metadata: Metadata = {
	title: "Projects",
};

// In the future we can have a pagination here e.g. /1/*.mdx
const projectsDirectory = path.join(
	process.cwd(),
	"app",
	"projects",
	"_projects"
);

interface ProjectListItemProps {
	company?: string;
	description?: string;
	slug: string;
	tags?: string[];
	title: string;
	startDate: string;
	endDate: string;
}

export function ProjectListItem({
	slug,
	title,
	tags = [],
	company,
	description,
	startDate,
	endDate,
}: ProjectListItemProps) {
	const companyIcon = getCompanyLogoSrc(company);
	const start = formatDate(startDate, "MMMYYYY");
	const end = endDate ? formatDate(endDate, "MMMYYYY") : "Present";

	return (
		<li className="my-4 font-medium">
			<NavLink
				className="group -mx-2 flex items-start px-2 focus-visible:rounded-xs focus-visible:outline focus-visible:outline-dotted focus-visible:outline-ring"
				href={`/projects/${slug}`}
			>
				<div className="flex min-w-0 flex-1 flex-col gap-2">
					<div className="flex items-center gap-2">
						{companyIcon && (
							<SvgIcon
								className="size-6 shrink-0"
								name={company ?? ""}
								src={companyIcon}
							/>
						)}

						<h1 className="text-balance font-semibold text-base md:text-xl">
							{title}
						</h1>
					</div>

					<p className="font-normal text-muted-foreground">
						{start} &rarr; {end}
					</p>

					<p className="font-normal text-muted-foreground">{description}</p>

					{tags.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{tags.map((tag) => (
								<Badge
									className="rounded-sm px-2 py-0.5 text-xs"
									key={tag}
									variant="secondary"
								>
									{tag}
								</Badge>
							))}
						</div>
					)}
				</div>
			</NavLink>
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
		startDate: string;
		endDate: string;
	}[] = [];

	for (const project of projects) {
		if (!project.endsWith(".mdx")) {
			continue;
		}

		const module = await import(`./_projects/${project}`);

		if (!module.metadata) {
			throw new Error(`Missing \`metadata\` in ${project}`);
		}
		if (module.metadata.draft) {
			continue;
		}

		items.push({
			slug: project.replace(MDX_REGEX, ""),
			title: module.metadata.title,
			sort: Number(module.metadata.sort || 0),
			tags: module.metadata.tags ?? [],
			company: module.metadata.company,
			description: module.metadata.description,
			startDate: module.metadata.startDate,
			endDate: module.metadata.endDate,
		});
	}

	items.sort((a, b) => b.sort - a.sort);

	return (
		<div>
			<ul className="mt-0 flex flex-col gap-y-8 [&>*:first-child]:mt-0">
				{items.map((item) => (
					<ProjectListItem
						company={item.company}
						description={item.description}
						key={item.slug}
						slug={item.slug}
						tags={item.tags}
						title={item.title}
						startDate={item.startDate}
						endDate={item.endDate}
					/>
				))}
			</ul>
		</div>
	);
}
