const VARIANTS = [
  ['', 's', 'a', 'b'],
  ['a', 's', '', 'b'],
  ['s', 'a', 'b', ''],
  ['b', '', 's', 'a'],
  ['a', 'b', 's', ''],
  ['', 'a', 'b', 's'],
  ['s', '', 'a', 'b'],
  ['b', 's', 'a', ''],
  ['', 'b', 's', 'a'],
  ['a', '', 'b', 's'],
  ['s', 'b', '', 'a'],
] as const

export function PixelCluster({ className, variant = 0 }: { className?: string; variant?: number }) {
  const cells = VARIANTS[((variant % VARIANTS.length) + VARIANTS.length) % VARIANTS.length]
  return (
    <span className={className ? `pixel-cluster ${className}` : 'pixel-cluster'} aria-hidden="true">
      {cells.map((cell, index) => (
        <span key={index} className={cell ? `pc-cell pc-${cell}` : 'pc-cell'} />
      ))}
    </span>
  )
}
