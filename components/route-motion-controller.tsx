'use client'

import { useEffect, ViewTransition } from 'react'
import type { ReactNode } from 'react'

const POST_LINK_SELECTOR = '[data-post-transition-link]'
const POST_LOADING_SHELL_SELECTOR = '[data-post-loading-shell]'
const ROUTE_MOTION_ATTRIBUTE = 'data-route-motion'

export function RouteMotionController() {
  useEffect(() => {
    const root = document.documentElement

    function disableRouteMotion() {
      root.setAttribute(ROUTE_MOTION_ATTRIBUTE, 'none')
    }

    function preparePointerRoute(event: PointerEvent) {
      const target = event.target
      const opensPost =
        event.isPrimary &&
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey &&
        target instanceof Element &&
        target.closest(POST_LINK_SELECTOR) !== null

      if (!opensPost) {
        disableRouteMotion()
      }
    }

    document.addEventListener('pointerdown', preparePointerRoute, true)
    document.addEventListener('keydown', disableRouteMotion, true)
    window.addEventListener('popstate', disableRouteMotion)

    return () => {
      document.removeEventListener('pointerdown', preparePointerRoute, true)
      document.removeEventListener('keydown', disableRouteMotion, true)
      window.removeEventListener('popstate', disableRouteMotion)
    }
  }, [])

  return null
}

export function RouteViewTransition({ children }: { children: ReactNode }) {
  function handleUpdate() {
    return () => {
      if (document.querySelector(POST_LOADING_SHELL_SELECTOR) === null) {
        document.documentElement.setAttribute(ROUTE_MOTION_ATTRIBUTE, 'none')
      }
    }
  }

  return (
    <ViewTransition default="route-content" onUpdate={handleUpdate}>
      {children}
    </ViewTransition>
  )
}
