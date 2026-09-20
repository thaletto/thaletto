import { PostTransitionLink } from '~/components/motion/post-transition-link'
import type { ProjectRow as ProjectRowData } from '~/lib/content/projects'
import { projectViewTransitionName } from '~/lib/motion/view-transition-name'

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
  const coverTransitionName = projectViewTransitionName('cover', project.slug)
  const titleTransitionName = projectViewTransitionName('title', project.slug)
  return (
    <PostTransitionLink
      href={`/projects/${safeSlug}`}
      coverTransitionName={coverTransitionName}
      titleTransitionName={titleTransitionName}
      className="group blog-row"
    >
      <Heading
        className="blog-row-title"
        style={{ viewTransitionName: titleTransitionName } as React.CSSProperties}
      >
        {project.title}
      </Heading>
      <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
        / {project.description}
      </span>
    </PostTransitionLink>
  )
}
