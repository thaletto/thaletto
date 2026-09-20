import Link from 'next/link'
import type { ProjectRow as ProjectRowData } from '~/lib/content/projects'

// The compact project row: the same register as the writing rows — title
// followed by a gray single-line description with a `/` prefix. Mobile
// titles may use two lines.
export function ProjectRow({
  project,
  headingLevel = 'h2',
}: {
  project: ProjectRowData
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
  const safeSlug = encodeURIComponent(project.slug)
  return (
    <Link href={`/projects/${safeSlug}`} className="group blog-row">
      <Heading className="blog-row-title">{project.title}</Heading>
      <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
        / {project.description}
      </span>
    </Link>
  )
}
