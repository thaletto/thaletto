// Locale-aware date formatting: single formatter reused across the shell so
// every surfaced date renders in the site's canonical en-US/SITE_TIME_ZONE.
import { SITE_TIME_ZONE } from '~/lib/design/date'

const enFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: SITE_TIME_ZONE,
})

export function LocalDate({ date }: { date: Date }) {
  return <>{enFormatter.format(date)}</>
}
