// `/timeline` view: every milestone laid on a vertical rail, read top-down
// with the page. The Lifeline is embedded (`mode="embed"`): it skips the
// auto-scroll intro and simply flows in the page, so the site's own dock
// and footer stay in charge of the scroll.
import { Lifeline, LifelineLegend } from '~/components/lifeline'
import { GhostSchematic } from '~/components/visual/ghost-schematic'
import { PixelCluster } from '~/components/visual/pixel-cluster'
import { careerLifeline } from '~/lib/content/lifeline'
import { publicPageMetadata } from '~/lib/metadata/public-page-metadata'

export function TimelinePageView() {
  return (
    <div className="relative mx-auto w-full max-w-150 px-6">
      <GhostSchematic className="top-4 right-6 hidden w-56 sm:block" />
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-136">
          <h1 className="page-eyebrow enter">{publicPageMetadata.timeline.title}</h1>
          {publicPageMetadata.timeline.description && (
            <p
              className="page-introduction enter mt-4 text-balance"
              style={{ '--enter-delay': '70ms' } as React.CSSProperties}
            >
              {publicPageMetadata.timeline.description}
            </p>
          )}
        </header>
        <PixelCluster className="enter shrink-0" />
      </div>

      <div className="mt-0">
        <Lifeline
          mode="embed"
          markers={careerLifeline.markers}
          birthYear={careerLifeline.birthYear}
          title={careerLifeline.name}
        />
        {careerLifeline.legend && (
          <div className="mt-4">
            <LifelineLegend />
          </div>
        )}
      </div>
    </div>
  )
}
