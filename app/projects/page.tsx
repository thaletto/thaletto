import { ProjectsPageView } from '../_views/projects-page'
import { pageMetadata } from '~/lib/metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.projects

export const metadata = pageMetadata({
  path: '/projects',
  ...copy,
})

export default function ProjectsPage() {
  return <ProjectsPageView />
}