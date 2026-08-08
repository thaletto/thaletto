import { BlogIndexPageView } from '../_views/blog-index-page'
import { pageMetadata } from '~/lib/metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.blog

export const metadata = pageMetadata({
  path: '/blog',
  ...copy,
})

export default function IndexPage() {
  return <BlogIndexPageView />
}