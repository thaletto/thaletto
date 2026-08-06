'use client'

import { useEffect, useRef } from 'react'

const ARM_DELAY = 750 // ms before observers attach — page entrance owns the fold
const BASE_DELAY = 80 // ms before the first block of a batch reveals
const STEP = 45 // ms between blocks revealing in the same frame
const THRESHOLD = 0.05

// Scroll reveal for long-form content. Below-fold blocks develop in as
// they're scrolled to; blocks entering in the same frame are drained in
// one rAF sorted by DOM order, so multi-column/tight groups reveal
// top-to-bottom instead of at random. The hidden state is applied from
// JS only — without JS (or with reduced motion) content is simply there.
export function RevealScope({
  as: Comp = 'div',
  children,
  className,
  style,
  ...props
}: {
  as?: 'div' | 'ul' | 'ol'
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (
      !root ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return

    const items = [...root.children].filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && el.getBoundingClientRect().top > window.innerHeight * 0.92,
    )
    if (items.length === 0) return
    for (const el of items) el.classList.add('reveal-pending')

    const reveal = (el: HTMLElement, delay: number) => {
      el.style.setProperty('--reveal-delay', `${delay}ms`)
      el.classList.remove('reveal-pending')
      el.classList.add('reveal-in')
    }

    // batch queue drained once per frame, sorted by document order
    let queue: HTMLElement[] = []
    let drainScheduled = false
    const drain = () => {
      drainScheduled = false
      const batch = queue
      queue = []
      batch.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      batch.forEach((el, i) => reveal(el, BASE_DELAY + i * STEP))
    }

    let io: IntersectionObserver | undefined
    const arm = setTimeout(() => {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            queue.push(entry.target as HTMLElement)
            io?.unobserve(entry.target)
          }
          if (queue.length && !drainScheduled) {
            drainScheduled = true
            requestAnimationFrame(drain)
          }
        },
        { threshold: THRESHOLD },
      )
      for (const el of items) if (el.classList.contains('reveal-pending')) io.observe(el)
    }, ARM_DELAY)

    // reaching the very bottom reveals anything left (nothing may stay hidden)
    const onScroll = () => {
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return
      for (const el of root.querySelectorAll<HTMLElement>('.reveal-pending')) {
        reveal(el, 0)
        io?.unobserve(el)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(arm)
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      for (const el of items) el.classList.remove('reveal-pending')
    }
  }, [])

  return (
    <Comp ref={ref as React.Ref<never>} className={className} style={style} {...props}>
      {children}
    </Comp>
  )
}
