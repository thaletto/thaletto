/** @vitest-environment jsdom */

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { PostRailNode } from '~/lib/content'

import { PostToc } from './post-toc'

const motionMocks = vi.hoisted(() => {
  let observer: ((target: Element | NodeListOf<Element>) => void) | null = null
  const controls: Array<{
    target: Element | NodeListOf<Element>
    cancel: ReturnType<typeof vi.fn>
    stop: ReturnType<typeof vi.fn>
    finished: Promise<void>
  }> = []
  const animate = vi.fn(
    (
      target: Element | NodeListOf<Element>,
      _keyframes?: unknown,
      _options?: unknown,
    ) => {
      observer?.(target)
      const control = {
        target,
        cancel: vi.fn(),
        stop: vi.fn(),
        finished: new Promise<void>(() => undefined),
      }
      controls.push(control)
      return control
    },
  )
  return {
    animate,
    clearObserver: () => {
      observer = null
    },
    controls,
    observe: (nextObserver: typeof observer) => {
      observer = nextObserver
    },
    stagger: vi.fn((each: number, options: { from: string }) => ({
      each,
      ...options,
    })),
  }
})

vi.mock('motion', () => ({
  animate: motionMocks.animate,
  stagger: motionMocks.stagger,
}))

vi.mock('next/link', () => ({
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}))

vi.mock('~/lib/locale-client', () => ({
  localize: (_locale: string, _zh: string, en: string) => en,
  useLocale: () => 'en',
}))

vi.mock('~/lib/locale-route', () => ({
  localePath: (_locale: string, path: string) => `/en${path}`,
}))

const nodes: PostRailNode[] = [
  {
    key: 'title',
    kind: 'landmark',
    id: 'article-start',
    label: 'Article',
    variant: 'title',
  },
  { key: 'gap-0', kind: 'tick' },
  {
    key: 'heading-1',
    kind: 'landmark',
    id: 'first',
    label: 'First',
    variant: 'heading',
  },
  { key: 'gap-1', kind: 'tick' },
  {
    key: 'heading-2',
    kind: 'landmark',
    id: 'second',
    label: 'Second',
    variant: 'heading',
  },
]

let viewport: 'desktop' | 'phone' | 'tablet' = 'phone'
let reducedMotion = false
let scrollY = 200
let frames: FrameRequestCallback[] = []
const scrollToMock = vi.fn(
  (options: ScrollToOptions | number, _y?: number) => {
    if (typeof options === 'object') scrollY = Number(options.top ?? scrollY)
  },
)

function matchesQuery(query: string) {
  if (query === '(prefers-reduced-motion: reduce)') return reducedMotion
  if (query === '(min-width: 64rem)') return viewport === 'desktop'
  if (query === '(max-width: 39.99rem)') return viewport === 'phone'
  return false
}

beforeEach(() => {
  viewport = 'phone'
  reducedMotion = false
  scrollY = 200
  frames = []
  motionMocks.animate.mockClear()
  motionMocks.stagger.mockClear()
  motionMocks.controls.length = 0
  motionMocks.clearObserver()
  scrollToMock.mockClear()

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: matchesQuery(query),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia,
  )
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    }),
  )
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  vi.stubGlobal(
    'DOMMatrixReadOnly',
    class {
      m42 = 0
    },
  )
  const getComputedStyle = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
    const style = getComputedStyle(element)
    return new Proxy(style, {
      get(target, property) {
        if (property === 'filter') return target.filter || 'none'
        if (property === 'opacity') return target.opacity || '1'
        if (property === 'transform') return target.transform || 'none'
        const value = Reflect.get(target, property)
        return typeof value === 'function' ? value.bind(target) : value
      },
    })
  })
  vi.stubGlobal('scrollTo', scrollToMock)
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    get: () => scrollY,
  })
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: 2400,
  })

  for (const [index, id] of ['article-start', 'first', 'second'].entries()) {
    const target = document.createElement('h2')
    target.id = id
    target.getBoundingClientRect = () => {
      const documentTop = index === 0 ? 60 : 760 + (index - 1) * 500
      const top = documentTop - scrollY
      return ({
        bottom: top + 40,
        height: 40,
        left: 0,
        right: 400,
        top,
        width: 400,
        x: 0,
        y: top,
        toJSON: () => ({}),
      }) as DOMRect
    }
    document.body.appendChild(target)
  }
})

afterEach(() => {
  cleanup()
  document.body.replaceChildren()
  history.replaceState(null, '', '/')
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('PostToc', () => {
  it('settles an in-flight phone map instantly for keyboard toggle actions', () => {
    const { container } = render(<PostToc nodes={nodes} />)
    const root = container.querySelector<HTMLElement>('.post-minimap-root')!

    fireEvent.click(screen.getByRole('button', { name: 'Open article map' }), {
      detail: 1,
    })
    const panelControl = motionMocks.controls.at(-2)!
    const nodeControl = motionMocks.controls.at(-1)!
    const panel = screen.getByRole('navigation', { name: 'Article map' })
    const item = container.querySelector<HTMLElement>('.post-minimap-node')!
    panel.style.opacity = '0.5'
    panel.style.transform = 'translateY(-4px)'
    panel.style.willChange = 'transform, opacity'
    item.style.filter = 'blur(1px)'
    item.style.opacity = '0.5'
    item.style.transform = 'translateY(-4px)'
    const controlCount = motionMocks.controls.length

    fireEvent.click(screen.getByRole('button', { name: 'Close article map' }), {
      detail: 0,
    })

    expect(root.getAttribute('data-toggle-motion')).toBe('instant')
    expect(screen.getByRole('button', { name: 'Open article map' }).getAttribute('aria-expanded')).toBe(
      'false',
    )
    expect(panelControl.cancel).toHaveBeenCalledOnce()
    expect(nodeControl.cancel).toHaveBeenCalledOnce()
    expect(motionMocks.controls).toHaveLength(controlCount)
    expect(panel.getAttribute('style')).toBe('')
    expect(item.getAttribute('style')).toBe('')
  })

  it('preserves phone pointer timing, direction, blur, and reversal arguments', () => {
    const { container } = render(<PostToc nodes={nodes} />)
    const root = container.querySelector<HTMLElement>('.post-minimap-root')!
    fireEvent.click(screen.getByRole('button', { name: 'Open article map' }), {
      detail: 0,
    })
    motionMocks.animate.mockClear()
    motionMocks.stagger.mockClear()
    motionMocks.controls.length = 0

    fireEvent.click(screen.getByRole('button', { name: 'Close article map' }), {
      detail: 1,
    })

    expect(root.getAttribute('data-toggle-motion')).toBeNull()
    expect(motionMocks.animate).toHaveBeenCalledTimes(2)
    expect(motionMocks.animate.mock.calls[0]?.[1]).toEqual({
      opacity: 0,
      transform: 'translateY(-12px) scale(0.96)',
    })
    expect(motionMocks.animate.mock.calls[0]?.[2]).toEqual({
      duration: 0.26,
      ease: [0.2, 0.8, 0.2, 1],
    })
    expect(motionMocks.animate.mock.calls[1]?.[1]).toEqual({
      filter: 'blur(2px)',
      opacity: 0,
      transform: 'translateY(-8px) rotate(2deg)',
    })
    expect(motionMocks.animate.mock.calls[1]?.[2]).toMatchObject({
      duration: 0.16,
      ease: [0.2, 0.8, 0.2, 1],
    })
    expect(motionMocks.stagger).toHaveBeenLastCalledWith(0.05, { from: 'last' })
  })

  it('closes compact maps instantly on Escape and restores toggle focus', () => {
    render(<PostToc nodes={nodes} />)
    const toggle = screen.getByRole('button', { name: 'Open article map' })
    fireEvent.click(toggle, { detail: 1 })
    const controlCount = motionMocks.controls.length
    const escape = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape',
    })

    act(() => window.dispatchEvent(escape))

    expect(escape.defaultPrevented).toBe(true)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle)
    expect(motionMocks.controls).toHaveLength(controlCount)
  })

  it('settles the desktop entrance when keyboard focus enters the open map', () => {
    viewport = 'desktop'
    const matches = Element.prototype.matches
    vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
      if (selector === ':focus-visible') return true
      return matches.call(this, selector)
    })
    const { container } = render(<PostToc nodes={nodes} />)
    act(() => frames.shift()?.(0))
    const entranceControl = motionMocks.controls.at(-1)!

    screen.getByRole('link', { name: 'First' }).focus()

    const root = container.querySelector<HTMLElement>('.post-minimap-root')!
    expect(root.getAttribute('data-toggle-motion')).toBe('instant')
    expect(screen.getByRole('button', { name: 'Close article map' }).getAttribute('aria-expanded')).toBe(
      'true',
    )
    expect(entranceControl.cancel).toHaveBeenCalledOnce()
  })

  it('distinguishes pointer-created focus from later keyboard focus locally', async () => {
    const matches = Element.prototype.matches
    vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
      if (selector === ':focus-visible') return true
      return matches.call(this, selector)
    })
    const { container } = render(<PostToc nodes={nodes} />)
    const root = container.querySelector<HTMLElement>('.post-minimap-root')!
    const toggle = screen.getByRole('button', { name: 'Open article map' })
    const island = container.querySelector('.post-minimap-island')
    const islandControl = motionMocks.controls.find((control) => control.target === island)!

    fireEvent.pointerDown(toggle)
    toggle.focus()

    expect(root.getAttribute('data-toggle-motion')).toBeNull()
    expect(islandControl.cancel).not.toHaveBeenCalled()

    toggle.blur()
    fireEvent.pointerDown(toggle)
    await act(async () => Promise.resolve())
    toggle.focus()

    expect(root.getAttribute('data-toggle-motion')).toBe('instant')
    expect(islandControl.cancel).toHaveBeenCalledOnce()
    expect((island as HTMLElement).style.opacity).toBe('1')
    expect((island as HTMLElement).style.transform).toBe(
      'translate(-50%, 0px) scale(1)',
    )
    expect((island as HTMLElement).style.willChange).toBe('')
  })

  it('closes before a keyboard landmark jump and settles visibility in the same frame', () => {
    const { container } = render(<PostToc nodes={nodes} />)
    const root = container.querySelector<HTMLElement>('.post-minimap-root')!
    const toggle = screen.getByRole('button', { name: 'Open article map' })
    fireEvent.click(toggle, { detail: 1 })
    const controlCount = motionMocks.controls.length
    const scrollStates: string[] = []
    scrollToMock.mockImplementation((options) => {
      scrollStates.push(toggle.getAttribute('aria-expanded') ?? '')
      if (typeof options === 'object') scrollY = Number(options.top ?? scrollY)
    })

    fireEvent.click(container.querySelector('a[href="#first"]')!, { detail: 0 })

    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(root.getAttribute('data-toggle-motion')).toBe('instant')
    expect(motionMocks.controls).toHaveLength(controlCount)
    expect(frames).toHaveLength(1)

    act(() => frames.shift()?.(0))

    expect(scrollStates).toEqual(['false'])
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 660 })
    expect(document.activeElement).toBe(document.getElementById('first'))
    expect(document.getElementById('first')?.getAttribute('tabindex')).toBe('-1')
    expect(location.hash).toBe('#first')
    expect(container.querySelector('a[href="#first"]')?.getAttribute('aria-current')).toBe(
      'location',
    )
    expect(
      container.querySelector('.post-minimap-back-to-top')?.hasAttribute('data-visible'),
    ).toBe(true)
    expect(root.getAttribute('data-scroll-motion')).toBeNull()
    expect(frames).toHaveLength(0)
  })

  it('settles an unchanged island target without suppressing the next reversal', () => {
    scrollY = 800
    const { container } = render(<PostToc nodes={nodes} />)
    const island = container.querySelector<HTMLElement>('.post-minimap-island')!
    const islandControl = motionMocks.controls.find(
      (control) => control.target === island,
    )!
    const controlCount = motionMocks.controls.length

    fireEvent.click(container.querySelector('a[href="#first"]')!, { detail: 0 })
    act(() => frames.shift()?.(0))

    expect(islandControl.cancel).toHaveBeenCalledOnce()
    expect(motionMocks.controls).toHaveLength(controlCount)
    expect(island.style.opacity).toBe('1')
    expect(island.style.transform).toBe('translate(-50%, 0px) scale(1)')

    motionMocks.animate.mockClear()
    scrollY = 0
    fireEvent.scroll(window)
    act(() => frames.shift()?.(16))

    expect(motionMocks.animate).toHaveBeenCalledOnce()
    expect(motionMocks.animate.mock.calls[0]?.[0]).toBe(island)
    expect(motionMocks.animate.mock.calls[0]?.[2]).toEqual({
      duration: 0.26,
      ease: [0.2, 0.8, 0.2, 1],
    })
  })

  it('sets the active compact landmark before starting its pointer close', () => {
    const { container } = render(<PostToc nodes={nodes} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open article map' }), {
      detail: 1,
    })
    motionMocks.animate.mockClear()
    const observedStates: Array<{ active: string | null; expanded: string | null }> = []
    motionMocks.observe(() => {
      observedStates.push({
        active: container
          .querySelector('a[href="#second"]')
          ?.getAttribute('aria-current') ?? null,
        expanded: container
          .querySelector('.post-minimap-toggle')
          ?.getAttribute('aria-expanded') ?? null,
      })
    })

    fireEvent.click(container.querySelector('a[href="#second"]')!, { detail: 1 })

    expect(motionMocks.animate).toHaveBeenCalledTimes(2)
    expect(observedStates[0]).toEqual({
      active: 'location',
      expanded: 'false',
    })
  })

  it('settles phone Back to top before returning from a keyboard click', () => {
    scrollY = 800
    const { container } = render(<PostToc nodes={nodes} />)
    const root = container.querySelector<HTMLElement>('.post-minimap-root')!
    const island = container.querySelector<HTMLElement>('.post-minimap-island')!
    const islandControl = motionMocks.controls.find((control) => control.target === island)!
    const toggle = screen.getByRole('button', { name: 'Open article map' })
    fireEvent.click(toggle, { detail: 1 })
    const controlCount = motionMocks.controls.length
    const backToTop = screen.getByRole('button', { name: 'Back to top' })
    const stateAtScroll: string[] = []
    scrollToMock.mockImplementation((options) => {
      stateAtScroll.push(toggle.getAttribute('aria-expanded') ?? '')
      if (typeof options === 'object') scrollY = Number(options.top ?? scrollY)
    })

    fireEvent.click(backToTop, { detail: 0 })

    expect(stateAtScroll).toEqual(['false'])
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(islandControl.cancel).toHaveBeenCalledOnce()
    expect(motionMocks.controls).toHaveLength(controlCount)
    expect(island.style.opacity).toBe('0')
    expect(island.style.transform).toBe('translate(-50%, -16px) scale(0.96)')
    expect(island.style.willChange).toBe('')
    expect(backToTop.hasAttribute('data-visible')).toBe(false)
    expect(root.getAttribute('data-scroll-motion')).toBeNull()
    expect(frames).toHaveLength(0)

    scrollY = 800
    fireEvent.scroll(window)
    act(() => frames.shift()?.(16))
    const ordinaryArrival = motionMocks.controls.at(-1)!
    expect(ordinaryArrival.target).toBe(island)
    expect(motionMocks.animate.mock.calls.at(-1)?.[2]).toEqual({
      duration: 0.28,
      ease: [0.2, 0.8, 0.2, 1],
    })

    scrollY = 0
    fireEvent.scroll(window)
    act(() => frames.shift()?.(32))
    expect(ordinaryArrival.stop).toHaveBeenCalledOnce()
    expect(motionMocks.animate.mock.calls.at(-1)?.[2]).toEqual({
      duration: 0.26,
      ease: [0.2, 0.8, 0.2, 1],
    })
  })

  it('keeps compact pointer Back to top smooth and animated', () => {
    scrollY = 800
    const { container } = render(<PostToc nodes={nodes} />)
    const root = container.querySelector<HTMLElement>('.post-minimap-root')!
    fireEvent.click(screen.getByRole('button', { name: 'Open article map' }), {
      detail: 1,
    })
    motionMocks.animate.mockClear()

    fireEvent.click(container.querySelector('.post-minimap-back-to-top')!, {
      detail: 1,
    })

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(screen.getByRole('button', { name: 'Open article map' }).getAttribute('aria-expanded')).toBe(
      'false',
    )
    expect(motionMocks.animate).toHaveBeenCalledTimes(2)
    expect(root.getAttribute('data-toggle-motion')).toBeNull()
    expect(root.getAttribute('data-scroll-motion')).toBeNull()
    expect(frames).toHaveLength(0)
  })

  it('settles reduced-motion pointer landmarks and Back to top without instant gates', () => {
    reducedMotion = true
    scrollY = 800
    const { container } = render(<PostToc nodes={nodes} />)
    const root = container.querySelector<HTMLElement>('.post-minimap-root')!
    fireEvent.click(screen.getByRole('button', { name: 'Open article map' }), {
      detail: 1,
    })
    const anchor = container.querySelector('a[href="#first"]')!

    fireEvent.click(anchor, { detail: 1 })
    expect(frames).toHaveLength(1)
    act(() => frames.shift()?.(0))

    expect(root.getAttribute('data-toggle-motion')).toBeNull()
    expect(root.getAttribute('data-scroll-motion')).toBeNull()
    expect(frames).toHaveLength(0)
    expect(motionMocks.animate).not.toHaveBeenCalled()

    fireEvent.click(container.querySelector('.post-minimap-back-to-top')!, {
      detail: 1,
    })

    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'auto' })
    expect(root.getAttribute('data-toggle-motion')).toBeNull()
    expect(root.getAttribute('data-scroll-motion')).toBeNull()
    expect(motionMocks.animate).not.toHaveBeenCalled()
    expect(frames).toHaveLength(0)
  })

  it('keeps desktop keyboard actions open and restores pointer transitions', () => {
    viewport = 'desktop'
    scrollY = 800
    const { container } = render(<PostToc nodes={nodes} />)
    act(() => frames.shift()?.(0))
    const root = container.querySelector<HTMLElement>('.post-minimap-root')!
    const toggle = screen.getByRole('button', { name: 'Close article map' })
    const entranceControl = motionMocks.controls.at(-1)!

    fireEvent.click(screen.getByRole('link', { name: 'First' }), { detail: 0 })

    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(root.getAttribute('data-toggle-motion')).toBe('instant')
    expect(entranceControl.cancel).toHaveBeenCalledOnce()
    act(() => frames.shift()?.(0))
    expect(root.getAttribute('data-scroll-motion')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }), {
      detail: 0,
    })

    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'auto' })
    expect(root.getAttribute('data-toggle-motion')).toBe('instant')

    root.setAttribute('data-scroll-motion', 'instant')
    fireEvent.pointerMove(root)
    expect(root.getAttribute('data-toggle-motion')).toBeNull()
    expect(root.getAttribute('data-scroll-motion')).toBe('instant')

    root.setAttribute('data-toggle-motion', 'instant')
    fireEvent.click(container.querySelector('a[href="#second"]')!, { detail: 1 })
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(root.getAttribute('data-toggle-motion')).toBeNull()
  })

  it('keeps outside pointer dismissal on the animated compact path', () => {
    render(<PostToc nodes={nodes} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open article map' }), {
      detail: 1,
    })
    motionMocks.animate.mockClear()

    fireEvent.pointerDown(document.body)

    expect(screen.getByRole('button', { name: 'Open article map' }).getAttribute('aria-expanded')).toBe(
      'false',
    )
    expect(motionMocks.animate).toHaveBeenCalledTimes(2)
  })

  it('settles ordinary reduced-motion measurements and cancels queued work on cleanup', () => {
    reducedMotion = true
    scrollY = 0
    const { container, unmount } = render(<PostToc nodes={nodes} />)
    const root = container.querySelector<HTMLElement>('.post-minimap-root')!
    const island = container.querySelector<HTMLElement>('.post-minimap-island')!
    motionMocks.animate.mockClear()

    scrollY = 800
    fireEvent.scroll(window)
    act(() => frames.shift()?.(0))

    expect(root.hasAttribute('data-island-visible')).toBe(true)
    expect(root.getAttribute('data-toggle-motion')).toBeNull()
    expect(root.getAttribute('data-scroll-motion')).toBeNull()
    expect(island.style.opacity).toBe('1')
    expect(island.style.transform).toBe('translate(-50%, 0px) scale(1)')
    expect(motionMocks.animate).not.toHaveBeenCalled()

    fireEvent.resize(window)
    expect(frames).toHaveLength(1)
    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalled()
  })
})
