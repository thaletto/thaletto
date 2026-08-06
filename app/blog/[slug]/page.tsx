import {
  blogPostMetadata,
  BlogPostRoute,
  generatePostStaticParams,
} from '../../_views/blog-post-page'

export const generateStaticParams = generatePostStaticParams

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return blogPostMetadata('en', (await params).slug)
}

export default function EnglishBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <BlogPostRoute params={params} locale="en" />
}
