import { PostTransitionLink } from '~/components/motion/post-transition-link'
import { DitheredImage } from '~/components/visual/dither-veil'
import type { Post } from '~/lib/content/posts'
import { formatMonthDay, formatShortDate } from '~/lib/design/date'
import { LocalDate } from '~/lib/design/i18n'
import { postViewTransitionName } from '~/lib/motion/view-transition-name'

// The compact post row: dithered print thumb · title · dotted leader · date.
// Mobile titles may use two lines; thumb and title stay shared morph elements.
export function PostRow({
  post,
  headingLevel = 'h2',
  dateStyle = 'full',
  listStageId,
}: {
  post: Post
  headingLevel?: 'h2' | 'h3'
  dateStyle?: 'full' | 'month-day' | 'short'
  listStageId?: string
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
      className="group blog-row hairline-top"
      listStageId={listStageId}
    >
      <span className="print-pile" aria-hidden>
        <span className="print-pile-sheet" />
        <span className="print-pile-sheet" />
        {post.cover ? (
          <span
            className="print-thumb"
            style={{ viewTransitionName: coverTransitionName } as React.CSSProperties}
          >
            <DitheredImage
              src={post.cover.src}
              alt=""
              width={64}
              height={44}
              sizes="64px"
              className="print-thumb-img"
            />
          </span>
        ) : (
          <span className="print-thumb print-thumb-empty" />
        )}
      </span>
      <Heading
        className="blog-row-title"
        style={{ viewTransitionName: titleTransitionName } as React.CSSProperties}
      >
        {post.title}
      </Heading>
      <span
        className="blog-row-leader"
        aria-hidden
        data-list-stage-target={listStageId ? '' : undefined}
      />
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
