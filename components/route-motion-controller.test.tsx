/** @vitest-environment jsdom */

import type { ReactNode } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const viewTransitionHarness = vi.hoisted(() => ({
  defaultClass: undefined as string | undefined,
  onUpdate: undefined as undefined | (() => void | (() => void)),
}))

vi.mock('react', async (importOriginal) => {
  const react = await importOriginal<typeof import('react')>()
  return {
    ...react,
    ViewTransition: ({
      children,
      default: defaultClass,
      onUpdate,
    }: {
      children: ReactNode
      default?: string
      onUpdate?: () => void | (() => void)
    }) => {
      viewTransitionHarness.defaultClass = defaultClass
      viewTransitionHarness.onUpdate = onUpdate
      return <>{children}</>
    },
  }
})

import {
  RouteMotionController,
  RouteViewTransition,
} from './route-motion-controller'

describe('RouteMotionController', () => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-route-motion', 'none')
    viewTransitionHarness.defaultClass = undefined
    viewTransitionHarness.onUpdate = undefined
  })

  afterEach(() => {
    cleanup()
    document.documentElement.removeAttribute('data-route-motion')
    vi.restoreAllMocks()
  })

  it('waits for a validated click before enabling post route motion', () => {
    render(
      <>
        <RouteMotionController />
        <a href="/blog/a-post" data-post-transition-link>
          <span>Read post</span>
        </a>
      </>,
    )

    fireEvent.pointerDown(screen.getByText('Read post'), {
      button: 0,
      isPrimary: true,
    })

    expect(document.documentElement.dataset.routeMotion).toBe('none')
  })

  it.each([
    ['an ordinary link', false, { button: 0, isPrimary: true }],
    [
      'a Command-clicked post link',
      true,
      { button: 0, isPrimary: true, metaKey: true },
    ],
    [
      'a Control-clicked post link',
      true,
      { button: 0, isPrimary: true, ctrlKey: true },
    ],
    [
      'a Shift-clicked post link',
      true,
      { button: 0, isPrimary: true, shiftKey: true },
    ],
    [
      'an Alt-clicked post link',
      true,
      { button: 0, isPrimary: true, altKey: true },
    ],
    ['a non-primary pointer', true, { button: 0, isPrimary: false }],
    ['a non-primary button', true, { button: 1, isPrimary: true }],
  ] satisfies Array<[string, boolean, PointerEventInit]>)(
    'keeps route motion disabled for %s',
    (_label, marked, eventInit) => {
      document.documentElement.removeAttribute('data-route-motion')
      render(
        <>
          <RouteMotionController />
          <a
            href="/blog/a-post"
            data-post-transition-link={marked || undefined}
          >
            Open link
          </a>
        </>,
      )

      fireEvent.pointerDown(
        screen.getByRole('link', { name: 'Open link' }),
        eventInit,
      )

      expect(document.documentElement.dataset.routeMotion).toBe('none')
    },
  )

  it('restores instant route motion on keydown', () => {
    render(<RouteMotionController />)
    document.documentElement.removeAttribute('data-route-motion')

    fireEvent.keyDown(document, { key: 'Enter' })

    expect(document.documentElement.dataset.routeMotion).toBe('none')
  })

  it('restores instant route motion on browser history navigation', () => {
    render(<RouteMotionController />)
    document.documentElement.removeAttribute('data-route-motion')

    fireEvent.popState(window)

    expect(document.documentElement.dataset.routeMotion).toBe('none')
  })

  it('removes every input and history listener on unmount', () => {
    const addDocumentListener = vi.spyOn(document, 'addEventListener')
    const removeDocumentListener = vi.spyOn(document, 'removeEventListener')
    const addWindowListener = vi.spyOn(window, 'addEventListener')
    const removeWindowListener = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<RouteMotionController />)
    const pointerListener = addDocumentListener.mock.calls.find(
      ([type]) => type === 'pointerdown',
    )?.[1]
    const keyboardListener = addDocumentListener.mock.calls.find(
      ([type]) => type === 'keydown',
    )?.[1]
    const popstateListener = addWindowListener.mock.calls.find(
      ([type]) => type === 'popstate',
    )?.[1]

    expect(pointerListener).toBeTypeOf('function')
    expect(keyboardListener).toBeTypeOf('function')
    expect(popstateListener).toBeTypeOf('function')

    unmount()

    expect(removeDocumentListener).toHaveBeenCalledWith(
      'pointerdown',
      pointerListener,
      true,
    )
    expect(removeDocumentListener).toHaveBeenCalledWith(
      'keydown',
      keyboardListener,
      true,
    )
    expect(removeWindowListener).toHaveBeenCalledWith(
      'popstate',
      popstateListener,
    )
  })

  it('restores instant motion only after the final post transition finishes', () => {
    const { rerender } = render(
      <RouteViewTransition>
        <article data-post-loading-shell>Loading article</article>
      </RouteViewTransition>,
    )
    document.documentElement.removeAttribute('data-route-motion')

    expect(viewTransitionHarness.defaultClass).toBe('route-content')
    const finishShellTransition = viewTransitionHarness.onUpdate?.()
    expect(finishShellTransition).toBeTypeOf('function')
    finishShellTransition?.()
    expect(document.documentElement.hasAttribute('data-route-motion')).toBe(
      false,
    )

    rerender(
      <RouteViewTransition>
        <article>Article content</article>
      </RouteViewTransition>,
    )
    const finishArticleTransition = viewTransitionHarness.onUpdate?.()
    expect(finishArticleTransition).toBeTypeOf('function')
    expect(document.documentElement.hasAttribute('data-route-motion')).toBe(
      false,
    )

    finishArticleTransition?.()

    expect(document.documentElement.dataset.routeMotion).toBe('none')
  })
})
