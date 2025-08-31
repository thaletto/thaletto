import { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { SiGithub } from 'react-icons/si';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function ProjectImage({
  image,
  name,
  link,
  github,
  priority,
}: {
  image: string;
  name: string;
  link?: string;
  github?: string;
  priority?: boolean;
}) {
  const handleClick = () => {
    if (link) {
      window.open(link, '_blank');
    } else if (github) {
      window.open(github, '_blank');
    }
  };

  return (
    <div
      className="group relative aspect-video w-full cursor-pointer"
      onClick={handleClick}
    >
      <Image
        src={image}
        alt={name}
        fill={true}
        className="rounded-xl object-cover"
        priority={priority}
      />
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

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority: boolean;
}) {
  return (
    <div key={project.id} className="space-y-2">
      <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset">
        <ProjectImage
          image={project.image}
          name={project.name}
          link={project.link}
          github={project.github}
          priority={priority}
        />
      </div>
      <div className="px-1">
        <span className="font-base text-lg text-zinc-900">{project.name}</span>
        <p className="text-base text-zinc-600">{project.description}</p>
        <p className="text-base text-zinc-600 italic">
          {new Date(project.date).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border border-zinc-400"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

