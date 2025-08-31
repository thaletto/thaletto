'use client';
import { Project } from "@/types";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { ProjectCard } from "./project";

interface Props {
    PROJECTS: Project[];
  }
  export function ProjectList({ PROJECTS }: Props) {
    const [showAll, setShowAll] = useState(false);
  
    const projectsToShow = showAll ? PROJECTS : PROJECTS.slice(0, 2);
  
    return (
      <>
        <div
          onClick={() => setShowAll((prev) => !prev)}
          className="mb-5 flex items-center gap-1 cursor-pointer"
        >
          <h3 className="text-xl font-medium text-zinc-900">Selected Projects</h3>
          <button
            type="button"
            className="ml-2 flex items-center justify-center rounded p-1 transition-transform"
            aria-label={showAll ? 'Show less' : 'Show all'}
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform duration-200 ${showAll ? 'rotate-90' : ''}`}
            />
          </button>
        </div>
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
  