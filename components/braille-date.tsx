import { brailleDate } from '~/lib/braille'
import { LocalDate } from '~/lib/i18n'

// Braille numerals as the visible caption; the readable date stays for
// assistive tech.
export function BrailleDate({ date }: { date: Date }) {
  return (
    <>
      <span aria-hidden>{brailleDate(date)}</span>
      <span className="sr-only"><LocalDate date={date} /></span>
    </>
  )
}
