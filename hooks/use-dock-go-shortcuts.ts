'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { playDockSound } from '~/lib/sound'

/** Single key → dock route (GitHub-style, without the G prefix). */
export const DOCK_GO_SHORTCUTS: Record<string, string> = {
  h: '/',
  w: '/blog',
  p: '/projects',
}

/** Uppercase shortcut key for a dock href, e.g. `/blog` → `"W"`. */
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
 * The shortcut machine both docks share: press a key and `resolve` maps it
 * to a destination (or ignores it). Typing contexts and modified keys never
 * navigate.
 */
function useGoShortcuts({
  activeHref,
  onNavigate,
  resolve,
}: {
  activeHref: string | undefined
  onNavigate?: (href: string, keyboardInitiated: boolean) => void
  resolve: (key: string) => GoTarget | undefined
}) {
  const router = useRouter()
  const activeHrefRef = useRef(activeHref)
  const onNavigateRef = useRef(onNavigate)
  const resolveRef = useRef(resolve)

  activeHrefRef.current = activeHref
  onNavigateRef.current = onNavigate
  resolveRef.current = resolve

  useEffect(() => {
    function goTo(target: GoTarget) {
      const isActive = activeHrefRef.current === target.href
      onNavigateRef.current?.(target.href, true)
      if (!isActive) playDockSound()
      router.push(target.href)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
      if (event.repeat) return
      if (isTypingTarget(event.target)) return

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      const target = resolveRef.current(key)
      if (!target) return

      event.preventDefault()
      goTo(target)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [router])
}

/**
 * Global shortcut keys for the public dock: press H / W / P to jump
 * Home / Writing / Projects.
 */
export function useDockGoShortcuts({
  activeHref,
  onNavigate,
}: {
  activeHref: string | undefined
  onNavigate?: (href: string, keyboardInitiated: boolean) => void
}) {
  useGoShortcuts({
    activeHref,
    onNavigate,
    resolve(key) {
      const href = DOCK_GO_SHORTCUTS[key]
      return href ? { href } : undefined
    },
  })
}