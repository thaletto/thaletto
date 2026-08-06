// The site's masthead stamp: a 2×2 dither cluster with one lit signal cell.
// The recurring home of the signal accent — a mark, never a control. Kept out
// of the accessibility tree; the page's real title carries the meaning.
//
// Each cell is one of: 's' (lit signal), 'a' (strong ink), 'b' (faint ink),
// or '' (empty). Every variant keeps exactly one 's', so the signal
// discipline holds while the arrangement shifts page to page.
const VARIANTS = [
  ['', 's', 'a', 'b'],
  ['a', 's', '', 'b'],
  ['s', 'a', 'b', ''],
  ['b', '', 's', 'a'],
  ['a', 'b', 's', ''],
  ['', 'a', 'b', 's'],
  // admin surfaces: Overview, AMA, Media, Photos, Booking detail
  ['s', '', 'a', 'b'],
  ['b', 's', 'a', ''],
  ['', 'b', 's', 'a'],
  ['a', '', 'b', 's'],
  ['s', 'b', '', 'a'],
] as const

export function PixelCluster({
  className,
  variant = 0,
}: {
  className?: string
  variant?: number
}) {
  const cells = VARIANTS[((variant % VARIANTS.length) + VARIANTS.length) % VARIANTS.length]
  return (
    <span
      className={className ? `pixel-cluster ${className}` : 'pixel-cluster'}
      aria-hidden="true"
    >
      {cells.map((cell, index) => (
        <span key={index} className={cell ? `pc-cell pc-${cell}` : 'pc-cell'} />
      ))}
    </span>
  )
}
