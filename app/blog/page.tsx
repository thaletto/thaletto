import { BlogIndexPageView } from '../_views/blog-index-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.blog.en

export const metadata = localeMetadata({
  locale: 'en',
  path: '/blog',
  ...copy,
})

export default function EnglishBlogIndexPage() {
  return <BlogIndexPageView locale="en" />
}
