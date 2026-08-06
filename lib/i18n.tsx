import { SITE_TIME_ZONE } from '~/lib/date'

// English is the only site language; <T> renders its English branch and
// drops the zh copy entirely.
export function T({ en }: { zh?: React.ReactNode; en: React.ReactNode }) {
  return <>{en}</>
}

const enFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: SITE_TIME_ZONE,
})

export function LocalDate({ date }: { date: Date }) {
  return <>{enFormatter.format(date)}</>
}
