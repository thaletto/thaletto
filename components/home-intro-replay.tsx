'use client'

import { useRef } from 'react'

export function HomeIntroReplay({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)

  const replay = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const element = ref.current
    if (!element) return

    element.classList.remove('home-intro-tap')
    void element.offsetWidth
    element.classList.add('home-intro-tap')
  }

  return (
    <span ref={ref} className="home-intro-trigger" onPointerDown={replay}>
      {children}
    </span>
  )
}
