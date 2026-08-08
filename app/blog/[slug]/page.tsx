import {
  blogPostMetadata,
  BlogPostRoute,
  generatePostStaticParams,
} from '../../_views/blog-post-page'

export const generateStaticParams = generatePostStaticParams

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return blogPostMetadata((await params).slug)
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <BlogPostRoute params={params} />
}
