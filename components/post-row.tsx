import { DitheredImage } from '~/components/dither-veil'
import { PostTransitionLink } from '~/components/post-transition-link'
import type { Post } from '~/lib/content'
import { formatMonthDay, formatShortDate } from '~/lib/date'
import { LocalDate, T } from '~/lib/i18n'
import { localePath, type Locale } from '~/lib/locale-route'
import { postViewTransitionName } from '~/lib/view-transition-name'

// The compact post row: dithered print thumb · title · dotted leader · date.
// Mobile titles may use two lines; thumb and title stay shared morph elements.
export function PostRow({
  post,
  headingLevel = 'h2',
  dateStyle = 'full',
  locale = 'en',
  listStageId,
}: {
  post: Post
  headingLevel?: 'h2' | 'h3'
  dateStyle?: 'full' | 'month-day' | 'short'
  locale?: Locale
  listStageId?: string
}) {
  const Heading = headingLevel
  const safeSlug = encodeURIComponent(post.slug)
  const coverTransitionName = postViewTransitionName('cover', post.slug)
  const titleTransitionName = postViewTransitionName('title', post.slug)
  return (
    <PostTransitionLink
      href={localePath(locale, `/blog/${safeSlug}`)}
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
        <T zh={post.title} en={post.titleEn} />
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
