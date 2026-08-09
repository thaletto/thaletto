// `/projects` index — the blueprint field listing with project cards, using
// the loaders in `lib/projects-content` and the shared PixelCluster accents.
import Image from 'next/image'
import Link from 'next/link'

import { GhostSchematic } from '~/components/visual/ghost-schematic'
import { ProjectsBlueprintStage } from '~/components/visual/hidden-list-stage'
import { PixelCluster } from '~/components/visual/pixel-cluster'
import { getProjectRows } from '~/lib/content/projects'
import { publicPageMetadata } from '~/lib/metadata/public-page-metadata'

export function ProjectsPageView() {
  const projects = getProjectRows()
  const center = (projects.length - 1) / 2

  return (
    <div className="relative mx-auto w-full max-w-150 px-6">
      <GhostSchematic className="top-4 right-6 hidden w-56 sm:block" />
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-136">
          <h1 className="page-eyebrow enter">Projects</h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            {publicPageMetadata.projects.description}
          </p>
        </header>
        <PixelCluster variant={3} className="enter shrink-0" />
      </div>

      <ProjectsBlueprintStage className="mt-10">
        <ul className="focus-list flex flex-col">
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className="enter-swing"
              style={
                {
                  '--enter-delay': `${120 + Math.abs(index - center) * 50}ms`,
                } as React.CSSProperties
              }
            >
              <Link
                href={`/projects/${project.slug}`}
                className="project-row hairline-top group"
                data-list-stage-row
                data-list-stage-id={project.slug}
              >
                <span className="project-icon-frame" aria-hidden="true" data-list-stage-anchor>
                  {project.cover ? (
                    <Image
                      src={project.cover.src}
                      alt=""
                      width={36}
                      height={36}
                      className="project-icon"
                    />
                  ) : (
                    <span className="project-icon project-icon-empty" />
                  )}
                </span>
                <span className="project-identity">
                  <span className="project-name font-medium">{project.title}</span>
                  <span className="project-domain text-muted-foreground">
                    {project.company ?? project.tags?.slice(0, 2).join(' · ')}
                  </span>
                </span>
                <span className="project-description text-muted-foreground">
                  {project.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </ProjectsBlueprintStage>
    </div>
  )
}
