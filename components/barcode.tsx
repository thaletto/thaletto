// Decorative label-graphic barcode: bar widths derive deterministically from
// the code string, so SSR output is stable. It scans as a barcode, not with
// one — ornament from the technical print register, kept out of the
// accessibility tree by the caller's aria-hidden wrapper.
function bars(code: string) {
  const runs: { x: number; w: number }[] = []
  let x = 0
  const push = (w: number, ink: boolean) => {
    if (ink) runs.push({ x, w })
    x += w
  }

  push(1, true)
  push(1, false)
  push(2, true)
  push(2, false)
  for (const ch of code) {
    const c = ch.charCodeAt(0)
    push((c % 3) + 1, true)
    push(((c >> 2) % 2) + 1, false)
    push(((c >> 4) % 3) + 1, true)
    push(1, false)
  }
  push(2, true)
  push(1, false)
  push(1, true)

  return { runs, width: x }
}

export function Barcode({ code, className }: { code: string; className?: string }) {
  const { runs, width } = bars(code)

  return (
    <span className={className ? `barcode ${className}` : 'barcode'} aria-hidden="true">
      <svg
        viewBox={`0 0 ${width} 24`}
        preserveAspectRatio="none"
        style={{ aspectRatio: `${width} / 24` }}
        shapeRendering="crispEdges"
      >
        {runs.map((run) => (
          <rect key={run.x} x={run.x} y="0" width={run.w} height="24" fill="currentColor" />
        ))}
      </svg>
      <span className="barcode-label">{code}</span>
    </span>
  )
}
