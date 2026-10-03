import { PostTransitionLink } from '~/components/motion/post-transition-link'
import type { Post } from '~/lib/content/posts'
import { formatMonthDay, formatShortDate } from '~/lib/design/date'
import { LocalDate } from '~/lib/design/i18n'
import { postViewTransitionName } from '~/lib/motion/view-transition-name'

// The compact post row: title / tagline ···· date (`/` prefix on desktop, own
// line on mobile). The tagline stays quiet until the row is hovered.
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
  const coverTransitionName = postViewTransitionName('cover', post.slug)
  const titleTransitionName = postViewTransitionName('title', post.slug)
  return (
    <PostTransitionLink
      href={`/blog/${safeSlug}`}
      coverTransitionName={coverTransitionName}
      titleTransitionName={titleTransitionName}
      className="group blog-row flex-wrap"
    >
      <Heading
        className="blog-row-title"
        style={{ viewTransitionName: titleTransitionName } as React.CSSProperties}
      >
        {post.title}
      </Heading>
      {post.description ? (
        <>
          <span aria-hidden className="hidden shrink-0 text-sm text-muted-foreground sm:inline">
            /
          </span>
          <span className="min-w-0 basis-full truncate text-sm text-muted-foreground transition-colors group-hover:text-foreground group-focus-visible:text-foreground sm:basis-auto sm:flex-1">
            {post.description}
          </span>
        </>
      ) : (
        <span className="blog-row-leader" aria-hidden />
      )}
      <time
        dateTime={post.publishedAt.toISOString()}
        className="blog-row-date shrink-0 text-muted-foreground tabular-nums"
      >
        {dateStyle === 'month-day' && formatMonthDay(post.publishedAt)}
        {dateStyle === 'short' && formatShortDate(post.publishedAt)}
        {dateStyle === 'full' && <LocalDate date={post.publishedAt} />}
      </time>
    </PostTransitionLink>
  )
}
