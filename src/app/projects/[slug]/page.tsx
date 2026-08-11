import {
  generateProjectStaticParams,
  ProjectPostRoute,
  projectMetadata,
} from '../../_views/project-post-page'

export const generateStaticParams = generateProjectStaticParams

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return projectMetadata((await params).slug)
}

export default function EnglishProjectPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProjectPostRoute params={params} />
}
