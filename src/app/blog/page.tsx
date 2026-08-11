import { pageMetadata } from '~/lib/metadata/page'
import { publicPageMetadata } from '~/lib/metadata/public-page-metadata'
import { BlogIndexPageView } from '../_views/blog-index-page'

const copy = publicPageMetadata.blog

export const metadata = pageMetadata({
  path: '/blog',
  ...copy,
})

export default function IndexPage() {
  return <BlogIndexPageView />
}
