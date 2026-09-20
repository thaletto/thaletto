export const SITE_TIME_ZONE = 'Asia/Kolkata'

const monthDayFormatter = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  timeZone: SITE_TIME_ZONE,
})

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  timeZone: SITE_TIME_ZONE,
})

const localDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: SITE_TIME_ZONE,
})

export function formatMonthDay(date: Date): string {
  return monthDayFormatter.format(date)
}

export function formatShortDate(date: Date): string {
  const parts = Object.fromEntries(
    shortDateFormatter
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  )

  return `${parts.year}/${parts.month}/${parts.day}`
}

export function formatLocalDate(date: Date): string {
  return localDateFormatter.format(date)
}
