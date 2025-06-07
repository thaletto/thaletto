import { Project } from '@/lib/types'
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from './ui/morphing-dialog'
import Image from 'next/image'
import { XIcon } from 'lucide-react'
import Link from 'next/link'
import { PROJECTS } from '@/lib/data'

function ProjectImage({ image, name }: { image: string; name: string }) {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger>
        <div className="relative aspect-video w-full">
          <Image
            src={image}
            alt={name}
            fill={true}
            className="cursor-zoom-in rounded-xl object-cover"
          />
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer className="min-h-[90vh] min-w-[90vw]">
        <MorphingDialogContent className="relative h-full w-full rounded-2xl p-4 ring-1 ring-zinc-200/50 ring-inset dark:ring-zinc-800/50">
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt={name}
              fill={true}
              className="object-contain"
            />
          </div>
        </MorphingDialogContent>
        <MorphingDialogClose className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1">
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div key={project.id} className="space-y-2">
      <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
        <ProjectImage image={project.image} name={project.name} />
      </div>
      <div className="px-1">
        <Link
          href={project.link}
          target="_blank"
          className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
        >
          {project.name}
          <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50"></span>
        </Link>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
      </div>
    </div>
  )
}

export function ProjectList() {
  return (
    <>
      <h3 className="mb-5 text-xl font-medium">Selected Projects</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  )
}
