import { Project } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS } from '@/lib/data';
import { SiGithub } from 'react-icons/si';
import { ChevronRight, ExternalLink } from 'lucide-react';

function ProjectImage({
  image,
  name,
  link,
  github,
}: {
  image: string;
  name: string;
  link?: string;
  github?: string;
}) {
  const handleClick = () => {
    if (link) {
      window.open(link, '_blank');
    } else if (github) {
      window.open(github, '_blank');
    }
  };

  return (
    <div className="group relative aspect-video w-full cursor-pointer" onClick={handleClick}>
      <Image src={image} alt={name} fill={true} className="rounded-xl object-cover" />
      <div className="absolute inset-0 flex items-center justify-center gap-8 rounded-xl bg-zinc-900/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {link && (
          <Link
            href={link}
            target="_blank"
            className="text-white transition-colors hover:text-zinc-200"
          >
            <ExternalLink className="h-6 w-6" />
          </Link>
        )}
        {github && (
          <Link
            href={github}
            target="_blank"
            className="text-white transition-colors hover:text-zinc-200"
          >
            <SiGithub className="h-6 w-6" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div key={project.id} className="space-y-2">
      <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
        <ProjectImage
          image={project.image}
          name={project.name}
          link={project.link}
          github={project.github}
        />
      </div>
      <div className="px-1">
        <span className="font-base text-lg text-zinc-900 dark:text-zinc-50">{project.name}</span>
        <p className="text-base text-zinc-600 dark:text-zinc-300">{project.description}</p>
        <p className="italic text-base text-zinc-600 dark:text-zinc-300">
          {project.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

export function ProjectList() {
  return (
    <>
      <div className="mb-5 flex items-center gap-1">
        <Link
          href="/projects"
          className="flex items-center gap-1 text-sm  text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
        >
          <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Selected Projects</h3>
          <ChevronRight className="mt-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PROJECTS.slice(0, 2).map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
