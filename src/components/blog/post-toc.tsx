'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { PostRailNode } from '~/lib/content/posts'

const DESKTOP_QUERY = '(min-width: 64rem)'
const PHONE_QUERY = '(max-width: 39.99rem)'
const PHONE_ISLAND_HIDDEN_TRANSFORM = 'translate(-50%, -16px) scale(0.96)'
const PHONE_ISLAND_VISIBLE_TRANSFORM = 'translate(-50%, 0px) scale(1)'
const TARGET_OFFSET = 100
const RAIL_ID = 'post-document-minimap'

function getReadingTop(target: HTMLElement) {
  return target.getBoundingClientRect().top
}

function WayfindingArrow({ direction }: { direction: 'back' | 'top' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === 'back' ? (
          <>
            <path d="m1.25,5.25h7c1.381,0,2.5,1.119,2.5,2.5h0c0,1.381-1.119,2.5-2.5,2.5h-1.25" />
            <polyline points="4.25 8.5 1 5.25 4.25 2" />
          </>
        ) : (
          <>
            <path d="M11.25 6C11.25 3.1005 8.89949 0.75 6 0.75C3.1005 0.75 0.75 3.10051 0.75 6" />
            <path d="M6 11.25L6 3.75" />
            <path d="M3.75 6L6 3.75L8.25 6" />
          </>
        )}
      </g>
    </svg>
  )
}

export function PostToc({ nodes }: { nodes: PostRailNode[] }) {
  const landmarks = useMemo(
    () =>
      nodes.filter(
        (node): node is Extract<PostRailNode, { kind: 'landmark' }> => node.kind === 'landmark',
      ),
    [nodes],
  )
  const phoneNodes = useMemo(() => {
    const firstHeading = nodes.findIndex(
      (node) => node.kind === 'landmark' && node.variant === 'heading',
    )
    return firstHeading > 0 ? nodes.slice(firstHeading) : nodes
  }, [nodes])
  const [open, setOpen] = useState(false)
  const [desktop, setDesktop] = useState(false)
  const [phone, setPhone] = useState(false)
  const [phoneQueryReady, setPhoneQueryReady] = useState(false)
  const [phoneIslandVisible, setPhoneIslandVisible] = useState(false)
  const [backToTopVisible, setBackToTopVisible] = useState(false)
  const [active, setActive] = useState(landmarks[0]?.id)
  const activeRef = useRef(active)
  const openRef = useRef(open)
  const desktopRef = useRef(desktop)
  const phoneRef = useRef(phone)
  const islandRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const progressCircleRef = useRef<SVGCircleElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const measureNowRef = useRef<(() => void) | null>(null)
  const pendingInstantMeasurementRef = useRef(false)
  const phoneQueryRef = useRef(false)
  const phoneIslandVisibleRef = useRef(false)
  const pointerFocusPendingRef = useRef(false)

  openRef.current = open
  desktopRef.current = desktop
  phoneRef.current = phone

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const first = landmarks[0]?.id
    activeRef.current = first
    setActive(first)
  }, [landmarks])

  // State changes apply immediately — no FLIP, no WAAPI, no stagger. Any
  // leftover inline styles from a previous frame are cleared so the
  // attribute-driven CSS is the single source of visibility.
  const setOpenState = useCallback((nextOpen: boolean) => {
    const items = rootRef.current?.querySelectorAll<HTMLElement>('.post-minimap-node')
    const panel = panelRef.current
    for (const item of items ?? []) {
      item.style.removeProperty('filter')
      item.style.removeProperty('opacity')
      item.style.removeProperty('transform')
    }
    panel?.style.removeProperty('opacity')
    panel?.style.removeProperty('transform')
    panel?.style.removeProperty('will-change')
    if (nextOpen !== openRef.current) setOpen(nextOpen)
  }, [])

  const settlePhoneIsland = useCallback((visible: boolean) => {
    const island = islandRef.current
    if (!island) return
    island.style.opacity = visible ? '1' : '0'
    island.style.transform = visible
      ? PHONE_ISLAND_VISIBLE_TRANSFORM
      : PHONE_ISLAND_HIDDEN_TRANSFORM
    island.style.removeProperty('will-change')
  }, [])

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY)
    const sync = () => {
      setDesktop(query.matches)
      setOpen(query.matches)
    }
    sync()
    query.addEventListener('change', sync)
    return () => {
      query.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY)
    const sync = () => {
      phoneQueryRef.current = query.matches
      setPhone(query.matches)
      setPhoneQueryReady(true)
    }
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const island = islandRef.current
    if (!phoneQueryReady || !island) return

    if (!phone) {
      island.style.removeProperty('opacity')
      island.style.removeProperty('transform')
      island.style.removeProperty('will-change')
      panelRef.current?.style.removeProperty('opacity')
      panelRef.current?.style.removeProperty('transform')
      panelRef.current?.style.removeProperty('will-change')
      return
    }

    settlePhoneIsland(phoneIslandVisible)
  }, [phone, phoneIslandVisible, phoneQueryReady, settlePhoneIsland])

  useEffect(() => {
    if (!open || desktop) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpenState(false)
      toggleRef.current?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      setOpenState(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [setOpenState, desktop, open])

  useEffect(() => {
    if (!phone || phoneIslandVisible || !open) return
    setOpenState(false)
  }, [setOpenState, open, phone, phoneIslandVisible])

  useEffect(() => {
    const targets = landmarks
      .map((node) => document.getElementById(node.id))
      .filter((element): element is HTMLElement => element !== null)
    if (targets.length === 0) return

    let frame = 0
    const measure = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      progressCircleRef.current?.setAttribute('stroke-dasharray', `${progress} 1`)
      const nextBackToTopVisible = window.scrollY >= window.innerHeight * 0.75
      const titleCard = document.querySelector('.post-title-card')
      const nextPhoneIslandVisible = titleCard
        ? titleCard.getBoundingClientRect().bottom <= TARGET_OFFSET
        : window.scrollY > 1

      const island = islandRef.current
      island?.style.removeProperty('opacity')
      island?.style.removeProperty('transform')
      island?.style.removeProperty('will-change')

      const islandVisibilityChanged = nextPhoneIslandVisible !== phoneIslandVisibleRef.current
      phoneIslandVisibleRef.current = nextPhoneIslandVisible
      setBackToTopVisible(nextBackToTopVisible)
      setPhoneIslandVisible(nextPhoneIslandVisible)
      if (phoneQueryRef.current && islandVisibilityChanged)
        settlePhoneIsland(nextPhoneIslandVisible)
      pendingInstantMeasurementRef.current = false

      let current = targets[0].id
      for (const target of targets) {
        if (getReadingTop(target) <= TARGET_OFFSET + 1) current = target.id
        else break
      }
      if (window.scrollY <= 1) current = targets[0].id
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = targets[targets.length - 1].id
      }
      if (current !== activeRef.current) setActive(current)
    }
    const requestMeasure = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }
    const measureNow = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      measure()
    }

    measureNowRef.current = measureNow
    measureNow()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', requestMeasure)
    return () => {
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', requestMeasure)
      if (frame) window.cancelAnimationFrame(frame)
      measureNowRef.current = null
      pendingInstantMeasurementRef.current = false
    }
  }, [landmarks, settlePhoneIsland])

  function visitLandmark(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    const keyboard = event.detail === 0

    setOpenState(desktop ? open : false)
    setActive(id)

    window.requestAnimationFrame(() => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
      if (keyboard) {
        pendingInstantMeasurementRef.current = true
      }
      window.scrollTo({ top: window.scrollY + getReadingTop(target) - TARGET_OFFSET })
      if (keyboard) measureNowRef.current?.()
      history.replaceState(null, '', `#${id}`)
    })
  }

  function returnToTop(event: React.MouseEvent<HTMLButtonElement>) {
    const keyboard = event.detail === 0
    setOpenState(desktop ? open : false)
    if (keyboard) {
      pendingInstantMeasurementRef.current = true
    }
    window.scrollTo({ top: 0 })
    if (keyboard) measureNowRef.current?.()
  }

  function markPointerFocusPending() {
    pointerFocusPendingRef.current = true
    queueMicrotask(() => {
      pointerFocusPendingRef.current = false
    })
  }

  function settleKeyboardFocus(event: React.FocusEvent<HTMLDivElement>) {
    const pointerCreated = pointerFocusPendingRef.current
    pointerFocusPendingRef.current = false
    if (pointerCreated) return
    if (!(event.target as HTMLElement).matches(':focus-visible')) return

    setOpenState(open)
    if (phoneQueryRef.current) {
      settlePhoneIsland(phoneIslandVisibleRef.current)
    }
  }

  if (landmarks.length < 2) return null

  const islandConcealed = !phoneQueryReady || (phone && !phoneIslandVisible)
  const displayedNodes = phone ? phoneNodes : nodes

  return (
    <div
      ref={rootRef}
      className="post-minimap-root"
      data-island-visible={phoneIslandVisible || undefined}
      data-open={open || undefined}
      onPointerDownCapture={markPointerFocusPending}
      onFocusCapture={settleKeyboardFocus}
    >
      <div className="post-minimap-backdrop backdrop-blur-sm" aria-hidden />
      <div
        ref={islandRef}
        className="post-minimap-island backdrop-blur-md"
        aria-hidden={islandConcealed || undefined}
        inert={islandConcealed ? true : undefined}
      >
        <button
          ref={toggleRef}
          type="button"
          className="post-minimap-toggle"
          aria-label={open ? 'Close article map' : 'Open article map'}
          aria-expanded={open}
          aria-controls={RAIL_ID}
          onClick={() => setOpenState(!open)}
        >
          <svg
            className="post-minimap-progress"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            aria-hidden
          >
            <circle className="post-minimap-progress-track" cx="10" cy="10" r="8" />
            <circle
              ref={progressCircleRef}
              className="post-minimap-progress-value"
              cx="10"
              cy="10"
              r="8"
              pathLength="1"
              strokeDasharray="0 1"
            />
          </svg>
          <span className="post-minimap-toggle-label" aria-hidden>
            {landmarks[0].label}
          </span>
          <svg
            className="post-minimap-toggle-icon"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.25 10.25H2.75C1.64543 10.25 0.75 9.35457 0.75 8.25V3.75C0.75 2.64543 1.64543 1.75 2.75 1.75H9.25C10.3546 1.75 11.25 2.64543 11.25 3.75V8.25C11.25 9.35457 10.3546 10.25 9.25 10.25Z" />
              <path
                className="post-minimap-toggle-panel"
                d="M3.25 4.25H4.25V7.75H3.25V4.25Z"
                fill="currentColor"
              />
              <path className="post-minimap-toggle-chevron" d="M8.25 7.5 6.75 6 8.25 4.5" />
            </g>
          </svg>
          <svg
            className="post-minimap-island-chevron"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden
          >
            <path d="M2.75 4.5 6 7.5 9.25 4.5" />
          </svg>
        </button>
        <nav
          ref={panelRef}
          id={RAIL_ID}
          className="post-minimap"
          aria-label="Article map"
          aria-hidden={!open}
          inert={open ? undefined : true}
        >
          <div className="post-minimap-phone-surface backdrop-blur-md" aria-hidden />
          <div className="post-minimap-utilities post-minimap-utilities-top">
            <Link href="/" className="post-minimap-utility" aria-label={'Back to home'}>
              <WayfindingArrow direction="back" />
              <span>Home</span>
            </Link>
          </div>
          <div className="post-minimap-clip">
            <div className="post-minimap-nodes">
              {displayedNodes.map((node) => (
                <div key={node.key} className="post-minimap-node" data-kind={node.kind}>
                  {node.kind === 'tick' ? (
                    <span className="post-minimap-tick" aria-hidden />
                  ) : (
                    <a
                      href={`#${node.id}`}
                      data-variant={node.variant}
                      aria-current={active === node.id ? 'location' : undefined}
                      aria-label={node.label}
                      title={node.label}
                      onClick={(event) => visitLandmark(event, node.id)}
                    >
                      <span className="post-minimap-tick" aria-hidden />
                      <span className="post-minimap-label">{node.label}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="post-minimap-utilities post-minimap-utilities-bottom">
            <button
              type="button"
              className="post-minimap-utility post-minimap-back-to-top"
              aria-label="Back to top"
              aria-hidden={!backToTopVisible}
              tabIndex={backToTopVisible ? 0 : -1}
              data-visible={backToTopVisible || undefined}
              onClick={returnToTop}
            >
              <WayfindingArrow direction="top" />
              <span>Top</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
