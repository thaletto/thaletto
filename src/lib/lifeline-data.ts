import type { LifelineEvent, LifelineLegendItem, LifelineMarker } from '~/components/lifeline/types'

/** The year the rail stops when a record has no `endYear`. */
export const LIFELINE_CURRENT_YEAR = 2026

export type LifelineMilestone = Omit<LifelineMarker, 'year'>
export type LifelineMilestones = Record<number, LifelineMilestone>

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

interface DefineLifelineInput {
  slug: string
  name: string
  birthYear: number
  endYear?: number
  description: string
  legend?: LifelineLegendItem[]
  milestones: LifelineMilestones
}

/**
 * Translated event texts keyed by year, aligned by index with the
 * source milestone's events. Only the text is swapped — images,
 * effects, mentors, and structure stay single-sourced.
 */
export type LifelineTextOverrides = Record<number, string[]>

/**
 * Swap an already-built marker list's event text for translated copies,
 * keyed by year and aligned by index with each milestone's events. Only
 * the text is replaced; images, effects, mentors, and structure stay
 * single-sourced.
 */
export function localizeLifelineMarkers(
  markers: LifelineMarker[],
  texts: LifelineTextOverrides,
): LifelineMarker[] {
  return markers.map((marker) => {
    const translated = texts[marker.year]
    if (!translated) return marker

    const events: LifelineEvent[] = marker.events.map((event, index) => {
      const text = translated[index]
      if (text === undefined) return event
      if (typeof event === 'string') return text
      if (Array.isArray(event)) return event
      return { ...event, text }
    })

    return { ...marker, events }
  })
}

/**
 * Build a full `LifelineRecord` from a year-keyed milestone map, filling
 * every year between birth and `endYear` (or the current year) so the
 * rail is contiguous even where nothing happened.
 */
export function defineLifeline(input: DefineLifelineInput): LifelineRecord {
  const { milestones, ...record } = input
  const lastYear = input.endYear ?? LIFELINE_CURRENT_YEAR
  const markers: LifelineMarker[] = []

  for (let year = input.birthYear; year <= lastYear; year++) {
    const milestone = milestones[year]

    markers.push(milestone ? { year, ...milestone } : { id: `year-${year}`, year, events: [] })
  }

  return { ...record, markers }
}
