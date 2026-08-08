import { SITE_TIME_ZONE } from '~/lib/date'

const enFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: SITE_TIME_ZONE,
})

export function LocalDate({ date }: { date: Date }) {
  return <>{enFormatter.format(date)}</>
}