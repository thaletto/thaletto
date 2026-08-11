import { pageMetadata } from '~/lib/metadata/page'
import { publicPageMetadata } from '~/lib/metadata/public-page-metadata'
import { TimelinePageView } from '../_views/timeline-page'

const copy = publicPageMetadata.timeline

export const metadata = pageMetadata({
  path: '/timeline',
  ...copy,
})

export default function TimelinePage() {
  return <TimelinePageView />
}
