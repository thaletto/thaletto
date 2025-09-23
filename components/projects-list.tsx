"use client";
import { Project } from "@/types";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { ProjectCard } from "./project";
import Link from "next/link";

interface Props {
  PROJECTS: Project[];
}
export function ProjectList({ PROJECTS }: Props) {
  const [showAll, setShowAll] = useState(false);

  const projectsToShow = PROJECTS.slice(0, 2);

  return (
    <>
      <Link href="/projects">
        <div className="mb-5 flex items-center gap-1 cursor-pointer">
          <h3 className="text-xl font-medium text-zinc-900">
            Selected Projects
          </h3>
          <ChevronRight className="mt-1" />
        </div>
      </Link>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projectsToShow
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((project) => (
            <ProjectCard key={project.id} project={project} priority={true} />
          ))}
      </div>
    </>
  );
}
