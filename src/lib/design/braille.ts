/**
 * Braille rendering helpers.
 *
 * ASCII digits are mapped one-to-one to their Braille Unicode forms, used to
 * turn numeric coordinates (dates, coordinates-counts) into a compact
 * tactile-inspired glyph in the site's visual language.
 */
const DIGITS: Record<string, string> = {
  '1': '⠁',
  '2': '⠃',
  '3': '⠉',
  '4': '⠙',
  '5': '⠑',
  '6': '⠋',
  '7': '⠛',
  '8': '⠓',
  '9': '⠊',
  '0': '⠚',
}

// Proper braille numerals: ⠼ (number sign) before each digit group,
// ⠲ as the point. Reads as dot texture on the print — the caption is
// still the date, just in the medium of the sheet.
export function brailleDate(date: Date): string {
  const groups = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  return groups.map((n) => `⠼${[...String(n)].map((d) => DIGITS[d]).join('')}`).join('⠲')
}

const LETTERS: Record<string, string> = {
  a: '⠁',
  b: '⠃',
  c: '⠉',
  d: '⠙',
  e: '⠑',
  f: '⠋',
  g: '⠛',
  h: '⠓',
  i: '⠊',
  j: '⠚',
  k: '⠅',
  l: '⠇',
  m: '⠍',
  n: '⠝',
  o: '⠕',
  p: '⠏',
  q: '⠟',
  r: '⠗',
  s: '⠎',
  t: '⠞',
  u: '⠥',
  v: '⠧',
  w: '⠺',
  x: '⠭',
  y: '⠽',
  z: '⠵',
}

// Latin letters as braille cells; a space between words maps to a blank cell.
// Ornamental dot texture in the print register — the readable text lives
// elsewhere, so unknown characters are simply skipped.
export function brailleText(text: string): string {
  return [...text.toLowerCase()].map((ch) => (ch === ' ' ? '⠀' : (LETTERS[ch] ?? ''))).join('')
}
