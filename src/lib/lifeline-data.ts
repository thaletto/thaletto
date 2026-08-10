import type { LifelineLegendItem, LifelineMarker } from '~/components/lifeline/types'

export interface LifelineRecord {
  slug: string
  name: string
  birthYear: number
  /** Last year on the timeline. Omit for living people. */
  endYear?: number
  description: string
  /** People-legend labels; defaults to Mentors / Met in person. */
  legend?: LifelineLegendItem[]
  markers: LifelineMarker[]
}
