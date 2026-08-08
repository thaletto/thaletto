'use client'

import { useEffect, useState } from 'react'

// The top and bottom rulers are arcs of an enormous circle — a bent steel
// rule, not a straight one. The radius is derived from a fixed 40px rise at
// the viewport edge (R = w²/8s), so at any width the ticks bow away and
// leave the screen at ~76% of the half-width: the left/right edges show no
// ruler at all. Ticks come free with the geometry: dashes on a stroked
// path render perpendicular to it.

const SAG = 40 // rise at the viewport edge, px
const INSET_TOP = 18 // where the top apex hugs the page
const INSET_BOTTOM = 6 // bottom rides 12px lower, closer to the edge
// barely-there inks: the rulers should be noticed on the second visit,
// never the first
const MAJOR = { len: 5, gap: 48, ink: 'rgb(255 255 255 / 0.18)' }
const MINOR = { len: 2.5, gap: 12, ink: 'rgb(255 255 255 / 0.12)' }
const H = 64 // svg canvas height; arcs clip against it like the viewport

function Arc({ w, edge }: { w: number; edge: 'top' | 'bottom' }) {
  const r = (w * w) / (8 * SAG)
  // centerline apex of the major ticks; minors sit flush to the same guide
  const apex = edge === 'top' ? INSET_TOP + MAJOR.len / 2 : H - INSET_BOTTOM - MAJOR.len / 2
  const chordY = edge === 'top' ? apex - SAG : apex + SAG
  const sweep = edge === 'top' ? 0 : 1
  const d = `M 0 ${chordY} A ${r} ${r} 0 0 ${sweep} ${w} ${chordY}`
  // normalize dashes to horizontal px and land one tick dead center
  const offset = -(w / 2 - 0.5)
  const minorShift = ((edge === 'top' ? -1 : 1) * (MAJOR.len - MINOR.len)) / 2
  return (
    <svg width={w} height={H} className={`column-ruler-arc column-ruler-arc-${edge}`} aria-hidden>
      <path
        d={d}
        pathLength={w}
        fill="none"
        stroke={MAJOR.ink}
        strokeWidth={MAJOR.len}
        strokeDasharray={`1 ${MAJOR.gap - 1}`}
        strokeDashoffset={offset}
      />
      <path
        d={d}
        pathLength={w}
        fill="none"
        stroke={MINOR.ink}
        strokeWidth={MINOR.len}
        strokeDasharray={`1 ${MINOR.gap - 1}`}
        strokeDashoffset={offset}
        transform={`translate(0 ${minorShift})`}
      />
    </svg>
  )
}

export function ArcRulers() {
  const [w, setW] = useState(0)
  useEffect(() => {
    const measure = () => setW(window.innerWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  if (!w) return null
  return (
    <>
      <Arc w={w} edge="top" />
      <Arc w={w} edge="bottom" />
    </>
  )
}
