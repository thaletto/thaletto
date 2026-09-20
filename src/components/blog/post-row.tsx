import Link from 'next/link'
import type { Post } from '~/lib/content/posts'
import { formatMonthDay, formatShortDate } from '~/lib/design/date'
import { LocalDate } from '~/lib/design/i18n'

// The compact post row: title · dotted leader · date.
// Mobile titles may use two lines.
export function PostRow({
  post,
  headingLevel = 'h2',
  dateStyle = 'full',
}: {
  post: Post
  headingLevel?: 'h2' | 'h3'
  dateStyle?: 'full' | 'month-day' | 'short'
}) {
  const Heading = headingLevel
  const safeSlug = encodeURIComponent(post.slug)
  return (
    <Link href={`/blog/${safeSlug}`} className="group blog-row">
      <Heading className="blog-row-title">{post.title}</Heading>
      <span className="blog-row-leader" aria-hidden />
      <time
        dateTime={post.publishedAt.toISOString()}
        className="blog-row-date shrink-0 text-muted-foreground tabular-nums"
      >
        {dateStyle === 'month-day' && formatMonthDay(post.publishedAt)}
        {dateStyle === 'short' && formatShortDate(post.publishedAt)}
        {dateStyle === 'full' && <LocalDate date={post.publishedAt} />}
      </time>
    </Link>
  )
}
