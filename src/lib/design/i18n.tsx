// Locale-aware date rendering: the canonical en-US/SITE_TIME_ZONE output
// lives in `design/date` (a plain module, safe to import from server-only
// code like next.config.ts); this component is its JSX projection.
import { formatLocalDate } from '~/lib/design/date'

export function LocalDate({ date }: { date: Date }) {
  return <>{formatLocalDate(date)}</>
}
