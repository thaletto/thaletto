// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GO_TIMEOUT_MS, useDockGoShortcuts } from './use-dock-go-shortcuts'

const push = vi.fn()
const playDockSound = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

vi.mock('~/lib/sound', () => ({
  playDockSound: () => playDockSound(),
}))

function Harness({
  locale = 'en' as const,
  activeHref = '/' as string | undefined,
  onNavigate,
}: {
  locale?: 'en'
  activeHref?: string | undefined
  onNavigate?: (href: string, keyboardInitiated: boolean) => void
}) {
  useDockGoShortcuts({ locale, activeHref, onNavigate })
  return null
}

function keydown(
  key: string,
  target: HTMLElement = document.body,
  init: KeyboardEventInit = {},
) {
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }),
  )
}

afterEach(() => {
  cleanup()
  push.mockClear()
  playDockSound.mockClear()
  vi.useRealTimers()
})

beforeEach(() => {
  vi.useFakeTimers()
})

describe('useDockGoShortcuts', () => {
  it('navigates with G then letter chords', () => {
    const onNavigate = vi.fn()
    render(<Harness activeHref="/blog" onNavigate={onNavigate} />)

    keydown('g')
    keydown('h')

    expect(onNavigate).toHaveBeenCalledWith('/', true)
    expect(playDockSound).toHaveBeenCalledOnce()
    expect(push).toHaveBeenCalledWith('/')
  })

  it.each([
    { key: 'w', href: '/blog' },
    { key: 'j', href: '/projects' },
  ] as const)('maps G then $key to $href', ({ key, href }) => {
    render(<Harness activeHref="/" />)

    keydown('g')
    keydown(key)

    expect(push).toHaveBeenCalledWith(href)
    expect(playDockSound).toHaveBeenCalledOnce()
  })

  it('ignores chords while typing in inputs', () => {
    render(<Harness />)
    const input = document.createElement('input')
    document.body.append(input)

    keydown('g', input)
    keydown('h', input)

    expect(push).not.toHaveBeenCalled()
    input.remove()
  })

  it('expires a pending G after the chord window', () => {
    render(<Harness />)

    keydown('g')
    vi.advanceTimersByTime(GO_TIMEOUT_MS)
    keydown('h')

    expect(push).not.toHaveBeenCalled()
  })

  it('ignores shifted letter keys while a chord is pending', () => {
    render(<Harness />)

    keydown('g')
    keydown('H', document.body, { shiftKey: true })

    expect(push).not.toHaveBeenCalled()
  })

  it('skips the dock sound when already on the target route', () => {
    render(<Harness activeHref="/projects" />)

    keydown('g')
    keydown('j')

    expect(push).toHaveBeenCalledWith('/projects')
    expect(playDockSound).not.toHaveBeenCalled()
  })
})
