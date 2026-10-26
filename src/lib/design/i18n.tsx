import { formatLocalDate } from '~/lib/design/date'

export function LocalDate({ date }: { date: Date }) {
  return <>{formatLocalDate(date)}</>
}
