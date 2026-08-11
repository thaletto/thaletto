import { pageMetadata } from '~/lib/metadata/page'
import { publicPageMetadata } from '~/lib/metadata/public-page-metadata'
import { ProjectsPageView } from '../_views/projects-page'

const copy = publicPageMetadata.projects

export const metadata = pageMetadata({
  path: '/projects',
  ...copy,
})

export default function ProjectsPage() {
  return <ProjectsPageView />
}
