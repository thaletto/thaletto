'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '~/lib/utils'

// Fluid horizontal scroll area: edge fades appear only while content
// actually continues in that direction — the fade is information, not
// decoration. State updates on scroll and resize; the fade strips tint
// with the surface behind them via --scroll-fade-surface.
export function ScrollAreaX({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: false, end: false })

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const update = () => {
      const start = viewport.scrollLeft > 1
      const end = viewport.scrollLeft < viewport.scrollWidth - viewport.clientWidth - 1
      setEdges((prev) =>
        prev.start === start && prev.end === end ? prev : { start, end },
      )
    }

    update()
    viewport.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    const observeChildren = () => {
      for (const child of viewport.children) observer.observe(child)
    }
    observer.observe(viewport)
    observeChildren()
    // Children mounted later (a dialog body populating asynchronously)
    // must re-arm measurement — re-observing an element is a no-op, and
    // detached nodes drop out of the ResizeObserver on their own.
    const mutations = new MutationObserver(() => {
      observeChildren()
      update()
    })
    mutations.observe(viewport, { childList: true })
    return () => {
      viewport.removeEventListener('scroll', update)
      mutations.disconnect()
      observer.disconnect()
    }
  }, [])

  return (
    <div className={cn('scroll-area-x', className)}>
      <div ref={viewportRef} className="scroll-area-x-viewport">
        {children}
      </div>
      <span
        aria-hidden
        className="scroll-area-x-fade scroll-area-x-fade-start"
        data-visible={edges.start || undefined}
      />
      <span
        aria-hidden
        className="scroll-area-x-fade scroll-area-x-fade-end"
        data-visible={edges.end || undefined}
      />
    </div>
  )
}

// Vertical sibling of ScrollAreaX: same mechanics, top/bottom edge fades.
// The outer element is a flex column so a flexed parent (e.g. a dialog
// body) sizes the viewport; standalone use sizes to content.
export function ScrollAreaY({
  className,
  style,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: false, end: false })

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const update = () => {
      const start = viewport.scrollTop > 1
      const end =
        viewport.scrollTop < viewport.scrollHeight - viewport.clientHeight - 1
      setEdges((prev) =>
        prev.start === start && prev.end === end ? prev : { start, end },
      )
    }

    update()
    viewport.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    const observeChildren = () => {
      for (const child of viewport.children) observer.observe(child)
    }
    observer.observe(viewport)
    observeChildren()
    // Children mounted later (a dialog body populating asynchronously)
    // must re-arm measurement — re-observing an element is a no-op, and
    // detached nodes drop out of the ResizeObserver on their own.
    const mutations = new MutationObserver(() => {
      observeChildren()
      update()
    })
    mutations.observe(viewport, { childList: true })
    return () => {
      viewport.removeEventListener('scroll', update)
      mutations.disconnect()
      observer.disconnect()
    }
  }, [])

  return (
    <div className={cn('scroll-area-y', className)} style={style}>
      <div ref={viewportRef} className="scroll-area-y-viewport">
        {children}
      </div>
      <span
        aria-hidden
        className="scroll-area-y-fade scroll-area-y-fade-start"
        data-visible={edges.start || undefined}
      />
      <span
        aria-hidden
        className="scroll-area-y-fade scroll-area-y-fade-end"
        data-visible={edges.end || undefined}
      />
    </div>
  )
}
