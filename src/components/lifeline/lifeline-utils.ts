import type { LifelineMarker } from './types'

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** True when a marker carries anything worth rendering beyond the axis. */
export function hasMarkerContent(marker: LifelineMarker) {
  return (
    marker.events.length > 0 ||
    (marker.companies?.length ?? 0) > 0 ||
    (marker.mentors?.length ?? 0) > 0 ||
    (marker.met?.length ?? 0) > 0
  )
}

/** True when a marker names people (mentors and/or people met in person). */
export function hasMarkerPeople(marker: LifelineMarker) {
  return (marker.mentors?.length ?? 0) > 0 || (marker.met?.length ?? 0) > 0
}

/** Reserve the vertical space a marker needs, scaled by the gap to the next. */
export function getMarkerHeight(marker: LifelineMarker, nextYear?: number) {
  const hasContent = hasMarkerContent(marker)
  const hasPeople = hasMarkerPeople(marker)

  if (!hasContent) return 48

  const peopleOnly =
    hasPeople && marker.events.length === 0 && (marker.companies?.length ?? 0) === 0

  let height = 96

  if (marker.companies?.length) height += 28
  height += marker.events.length * 44

  if (peopleOnly) height += 88
  else if (hasPeople) height += 108

  if (!nextYear) return Math.min(520, Math.max(peopleOnly ? 148 : 188, height))

  const gap = Math.max(1, nextYear - marker.year)
  height += Math.min(32, gap * 3)

  return Math.min(520, Math.max(peopleOnly ? 148 : 188, height))
}
