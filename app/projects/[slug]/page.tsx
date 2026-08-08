import {
  generateProjectStaticParams,
  projectMetadata,
  ProjectPostPageView,
} from '../../_views/project-post-page'

export const generateStaticParams = generateProjectStaticParams

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return projectMetadata((await params).slug)
}

export default async function EnglishProjectPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ProjectPostPageView slug={slug} />
}
