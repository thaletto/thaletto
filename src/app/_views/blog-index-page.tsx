// `/blog` index — posts grouped by year, newest first, each in a reveal-scope
// row so scrolling stays alive on a long page.
import { GeistPixelSquare } from 'geist/font/pixel'
import { PostRow } from '~/components/blog/post-row'
import { RevealScope } from '~/components/motion/reveal-scope'
import { WritingInkStage } from '~/components/visual/hidden-list-stage'
import { PixelCluster } from '~/components/visual/pixel-cluster'
import { getAllPosts } from '~/lib/content/posts'

export function BlogIndexPageView() {
  const posts = getAllPosts()
  const postsByYear = new Map<number, typeof posts>()

  for (const post of posts) {
    const year = post.publishedAt.getUTCFullYear()
    const yearPosts = postsByYear.get(year)

    if (yearPosts) yearPosts.push(post)
    else postsByYear.set(year, [post])
  }

  return (
    <div className="mx-auto w-full max-w-150 px-6">
      <header className="enter flex items-center justify-between">
        <h1 className="page-eyebrow">Writing</h1>
        <PixelCluster variant={1} />
      </header>
      <WritingInkStage className="mt-6" contentClassName="flex flex-col gap-8">
        {[...postsByYear].map(([year, yearPosts]) => {
          const center = (yearPosts.length - 1) / 2

          return (
            <section key={year} aria-labelledby={`posts-${year}`} className="relative">
              {/* ghost folio: the year as a print folio numeral, at the edge of perception */}
              <span aria-hidden className={`ghost-folio ${GeistPixelSquare.className}`}>
                {String(year).slice(2)}
              </span>
              <h2
                id={`posts-${year}`}
                className="enter text-sm font-medium text-muted-foreground tabular-nums"
              >
                {year}
              </h2>
              <RevealScope as="ul" className="focus-list mt-2 flex flex-col">
                {yearPosts.map((post, index) => (
                  <li
                    key={post.slug}
                    className="enter-swing"
                    style={
                      {
                        '--enter-delay': `${120 + Math.abs(index - center) * 50}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <PostRow
                      post={post}
                      headingLevel="h3"
                      dateStyle="month-day"
                      listStageId={post.slug}
                    />
                  </li>
                ))}
              </RevealScope>
            </section>
          )
        })}
      </WritingInkStage>
    </div>
  )
}
