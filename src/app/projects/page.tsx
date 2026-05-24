import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { MDX_REGEX } from "@/lib/const";
import ProjectCard from "@/components/projects/project-card";

export const metadata: Metadata = {
	title: "Projects",
	openGraph: {
		images: ["/og/projects.png"],
	},
};

const projectsDirectory = path.join(
	process.cwd(),
	"src",
	"app",
	"projects",
	"_projects"
);

const rotations = [
	"rotate-1",
	"-rotate-2",
	"rotate-[2.5deg]",
	"-rotate-1",
	"rotate-2",
	"-rotate-[2.5deg]",
];

export default async function Page() {
	const projects = await fs.readdir(projectsDirectory);

	const projectFiles = projects.filter((f) => f.endsWith(".mdx"));

	const items = (
		await Promise.all(
			projectFiles.map(async (project) => {
				const module = await import(`./_projects/${project}`);

				if (!module.metadata) {
					throw new Error(`Missing \`metadata\` in ${project}`);
				}
				if (module.metadata.draft) {
					return null;
				}

				return {
					slug: project.replace(MDX_REGEX, ""),
					title: module.metadata.title,
					sort: Number(module.metadata.sort || 0),
					tags: module.metadata.tags ?? [],
					company: module.metadata.company,
					description: module.metadata.description,
					startDate: module.metadata.startDate,
					endDate: module.metadata.endDate,
					image: module.metadata.image,
				};
			})
		)
	).filter((item): item is NonNullable<typeof item> => item !== null);

	items.sort((a, b) => b.sort - a.sort);

	return (
		<div className="mx-auto max-w-4xl py-8">
			<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 justify-items-center">
				{items.map((item, index) => {
					const rotationClass = rotations[index % rotations.length];
					return (
						<div
							key={item.slug}
							className="group/item w-full flex justify-center"
						>
							<ProjectCard
								className={rotationClass}
								endDate={item.endDate}
								image={item.image}
								slug={item.slug}
								startDate={item.startDate}
								tags={item.tags}
								title={item.title}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
