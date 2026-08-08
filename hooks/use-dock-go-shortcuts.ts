'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { playDockSound } from '~/lib/sound'

export const GO_TIMEOUT_MS = 1000

/** G then <key> → dock route (GitHub-style). */
export const DOCK_GO_SHORTCUTS: Record<string, string> = {
  h: '/',
  w: '/blog',
  j: '/projects',
}

/** Uppercase second key for a dock href, e.g. `/blog` → `"W"`. */
export function dockGoKeyFor(href: string): string | undefined {
  const entry = Object.entries(DOCK_GO_SHORTCUTS).find(([, path]) => path === href)
  return entry?.[0]?.toUpperCase()
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

type GoTarget = { href: string }

/**
 * The chord machine both docks share: press G, then a second key within the
 * window; `resolve` maps that key to a destination (or ignores it). Escape
 * or the timeout cancels; typing contexts and modified keys never chord.
 */
function useGoChords({
  activeHref,
  onNavigate,
  resolve,
}: {
  activeHref: string | undefined
  onNavigate?: (href: string, keyboardInitiated: boolean) => void
  resolve: (key: string) => GoTarget | undefined
}) {
  const router = useRouter()
  const pendingGoRef = useRef(false)
  const timeoutRef = useRef<number | null>(null)
  const activeHrefRef = useRef(activeHref)
  const onNavigateRef = useRef(onNavigate)
  const resolveRef = useRef(resolve)

  activeHrefRef.current = activeHref
  onNavigateRef.current = onNavigate
  resolveRef.current = resolve

  useEffect(() => {
    function clearPending() {
      pendingGoRef.current = false
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    function armGo() {
      pendingGoRef.current = true
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(clearPending, GO_TIMEOUT_MS)
    }

    function goTo(target: GoTarget) {
      const isActive = activeHrefRef.current === target.href
      onNavigateRef.current?.(target.href, true)
      if (!isActive) playDockSound()
      router.push(target.href)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        clearPending()
        return
      }
      if (event.repeat) return
      if (isTypingTarget(event.target)) {
        clearPending()
        return
      }

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key

      if (!pendingGoRef.current) {
        if (key === 'g') {
          event.preventDefault()
          armGo()
        }
        return
      }

      if (key === 'Escape') {
        event.preventDefault()
        clearPending()
        return
      }

      if (key === 'g') {
        event.preventDefault()
        armGo()
        return
      }

      const target = resolveRef.current(key)
      clearPending()
      if (!target) return

      event.preventDefault()
      goTo(target)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      clearPending()
    }
  }, [router])
}

/**
 * Global chord shortcuts for the public dock: press G, then H / W / J within
 * a short window to jump Home / Writing / Projects.
 */
export function useDockGoShortcuts({
  activeHref,
  onNavigate,
}: {
  activeHref: string | undefined
  onNavigate?: (href: string, keyboardInitiated: boolean) => void
}) {
  useGoChords({
    activeHref,
    onNavigate,
    resolve(key) {
      const href = DOCK_GO_SHORTCUTS[key]
      return href ? { href } : undefined
    },
  })
}