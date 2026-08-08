'use client'

import Link from 'next/link'
import type { MouseEvent, ReactNode } from 'react'

export function PostTransitionLink({
  href,
  coverTransitionName,
  titleTransitionName,
  className,
  children,
  listStageId,
}: {
  href: string
  coverTransitionName: string
  titleTransitionName: string
  className?: string
  children: ReactNode
  listStageId?: string
}) {
  function preparePointerMorph(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    const root = document.documentElement
    if (event.detail === 0) {
      root.setAttribute('data-route-motion', 'none')
      root.style.removeProperty('--post-cover-transition-name')
      root.style.removeProperty('--post-title-transition-name')
      return
    }

    root.removeAttribute('data-route-motion')
    root.style.setProperty('--post-cover-transition-name', coverTransitionName)
    root.style.setProperty('--post-title-transition-name', titleTransitionName)
  }

  return (
    <Link
      href={href}
      className={className}
      data-post-transition-link
      data-list-stage-row={listStageId ? '' : undefined}
      data-list-stage-id={listStageId}
      onClick={preparePointerMorph}
    >
      {children}
    </Link>
  )
}
