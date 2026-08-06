/** @vitest-environment jsdom */

import { readFileSync } from 'node:fs'

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@base-ui/react/preview-card', async () => {
  const React = await import('react')

  type PopupState = {
    instant: 'dismiss' | 'focus' | undefined
    open: boolean
    transitionStatus: 'ending' | 'starting'
  }
  type Payload = { id: string; popup: React.ReactNode }
  type Controller = {
    close: (instant?: PopupState['instant']) => void
    open: (payload: Payload | undefined, instant?: PopupState['instant']) => void
  }
  type Handle = { controller?: Controller }

  const RootContext = React.createContext<Handle | null>(null)
  const PopupContext = React.createContext<PopupState>({
    instant: undefined,
    open: false,
    transitionStatus: 'starting',
  })

  function Root({
    children,
    handle,
    onOpenChange,
  }: {
    children:
      | React.ReactNode
      | ((value: { payload: Payload | undefined }) => React.ReactNode)
    handle?: Handle
    onOpenChange?: (open: boolean) => void
  }) {
    const localHandle = React.useRef<Handle>({}).current
    const activeHandle = handle ?? localHandle
    const [payload, setPayload] = React.useState<Payload>()
    const [popupState, setPopupState] = React.useState<PopupState>({
      instant: undefined,
      open: false,
      transitionStatus: 'starting',
    })

    React.useLayoutEffect(() => {
      activeHandle.controller = {
        close(instant) {
          setPopupState((current) => ({
            ...current,
            instant,
            open: false,
            transitionStatus: 'ending',
          }))
          onOpenChange?.(false)
        },
        open(nextPayload, instant) {
          setPayload(nextPayload)
          setPopupState((current) => ({
            instant,
            open: true,
            transitionStatus:
              current.transitionStatus === 'ending' ? 'ending' : 'starting',
          }))
          onOpenChange?.(true)
        },
      }
      return () => {
        activeHandle.controller = undefined
      }
    }, [activeHandle, onOpenChange])

    return (
      <RootContext.Provider value={activeHandle}>
        <PopupContext.Provider value={popupState}>
          <div data-preview-root="">
            {typeof children === 'function' ? children({ payload }) : children}
          </div>
        </PopupContext.Provider>
      </RootContext.Provider>
    )
  }

  function Trigger({
    children,
    closeDelay,
    delay,
    handle,
    payload,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    closeDelay?: number
    delay?: number
    handle?: Handle
    payload?: Payload
  }) {
    const localHandle = React.useContext(RootContext)
    const activeHandle = handle ?? localHandle
    return (
      <a
        {...props}
        data-close-delay={closeDelay}
        data-delay={delay}
        onBlur={() => activeHandle?.controller?.close('dismiss')}
        onFocus={() => activeHandle?.controller?.open(payload, 'focus')}
        onKeyDown={(event) => {
          if (event.key === 'Escape') activeHandle?.controller?.close('dismiss')
        }}
        onMouseEnter={() => activeHandle?.controller?.open(payload)}
        onMouseLeave={() => activeHandle?.controller?.close()}
      >
        {children}
      </a>
    )
  }

  function Popup({
    children,
    className,
  }: {
    children: React.ReactNode
    className: string | ((state: PopupState) => string)
  }) {
    const state = React.useContext(PopupContext)
    return (
      <div
        className={typeof className === 'function' ? className(state) : className}
        data-popup=""
        data-transition-status={state.transitionStatus}
      >
        {children}
      </div>
    )
  }

  return {
    PreviewCard: {
      createHandle: () => ({}),
      Root,
      Trigger,
      Portal: ({ children }: { children: React.ReactNode }) => children,
      Positioner: ({
        children,
        side,
      }: {
        children: React.ReactNode
        side?: string
      }) => <div data-positioner-side={side}>{children}</div>,
      Popup,
    },
  }
})

import {
  PreviewCardTimingProvider,
  SitePreviewCard,
} from './preview-card-timing'

function PreviewPair() {
  return (
    <PreviewCardTimingProvider>
      <SitePreviewCard
        href="https://example.com/a"
        triggerClassName="trigger"
        closeDelay={100}
        popupClassName="link-card"
        popup={
          <span data-payload="a" style={{ display: 'block', height: 24 }}>
            Alpha card
          </span>
        }
        side="top"
      >
        Alpha
      </SitePreviewCard>
      <SitePreviewCard
        href="https://example.com/b"
        triggerClassName="trigger"
        closeDelay={120}
        popupClassName="link-card service-card"
        popup={
          <span data-payload="b" style={{ display: 'block', height: 72 }}>
            Beta card
            <span className="contrib-grid">
              <i />
            </span>
          </span>
        }
        side="bottom"
      >
        Beta
      </SitePreviewCard>
    </PreviewCardTimingProvider>
  )
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('preview card timing', () => {
  it('uses one cold shared root before any trigger provides a payload', () => {
    const { container } = render(<PreviewPair />)

    expect(container.querySelectorAll('[data-preview-root]')).toHaveLength(1)
    expect(container.querySelector('[data-popup]')).toBeNull()
    for (const trigger of screen.getAllByRole('link')) {
      expect(trigger.getAttribute('data-delay')).toBe('300')
    }
  })

  it('stays warm while open and for exactly 300ms after close', () => {
    render(<PreviewPair />)
    const [alpha, beta] = screen.getAllByRole('link')

    fireEvent.mouseEnter(alpha)
    expect(screen.getByText('Alpha card')).not.toBeNull()
    expect(beta.getAttribute('data-delay')).toBe('0')

    fireEvent.mouseLeave(alpha)
    act(() => vi.advanceTimersByTime(299))
    expect(beta.getAttribute('data-delay')).toBe('0')
    act(() => vi.advanceTimersByTime(1))
    expect(beta.getAttribute('data-delay')).toBe('300')
  })

  it('cancels cooldown and preserves one Popup while switching payloads mid-exit', () => {
    const { container } = render(<PreviewPair />)
    const [alpha, beta] = screen.getAllByRole('link')
    fireEvent.mouseEnter(alpha)
    const popup = container.querySelector('[data-popup]')

    fireEvent.mouseLeave(alpha)
    act(() => vi.advanceTimersByTime(200))
    expect(popup?.getAttribute('data-transition-status')).toBe('ending')
    fireEvent.mouseEnter(beta)

    expect(container.querySelector('[data-popup]')).toBe(popup)
    expect(container.querySelector('[data-payload="a"]')).toBeNull()
    expect(container.querySelector('[data-payload="b"]')?.textContent).toContain(
      'Beta card',
    )
    expect(
      (container.querySelector('[data-payload="b"]') as HTMLElement).style.height,
    ).toBe('72px')
    expect(
      container
        .querySelector('[data-positioner-side]')
        ?.getAttribute('data-positioner-side'),
    ).toBe('bottom')
    act(() => vi.advanceTimersByTime(200))
    expect(beta.getAttribute('data-delay')).toBe('0')
  })

  it('marks focus and dismiss states instant, including contribution cells', () => {
    const { container } = render(<PreviewPair />)
    const beta = screen.getByRole('link', { name: 'Beta' })

    fireEvent.focus(beta)
    expect(container.querySelector('[data-popup]')?.className).toContain(
      'preview-card-instant',
    )
    expect(container.querySelector('.contrib-grid i')).not.toBeNull()

    fireEvent.keyDown(beta, { key: 'Escape' })
    expect(container.querySelector('[data-popup]')?.className).toContain(
      'preview-card-instant',
    )
  })

  it('clears its cooldown timer when the provider unmounts', () => {
    const { unmount } = render(<PreviewPair />)
    const alpha = screen.getByRole('link', { name: 'Alpha' })
    fireEvent.mouseEnter(alpha)
    fireEvent.mouseLeave(alpha)
    expect(vi.getTimerCount()).toBe(1)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })

  it('keeps a standalone local root with the cold delay', () => {
    const { container } = render(
      <SitePreviewCard
        href="https://example.com/local"
        triggerClassName="trigger"
        closeDelay={100}
        popupClassName="link-card"
        popup={<span>Local card</span>}
      >
        Local
      </SitePreviewCard>,
    )

    const trigger = screen.getByRole('link', { name: 'Local' })
    expect(container.querySelectorAll('[data-preview-root]')).toHaveLength(1)
    expect(trigger.getAttribute('data-delay')).toBe('300')
    fireEvent.focus(trigger)
    expect(screen.getByText('Local card')).not.toBeNull()
  })

  it('keeps the pointer cascade but disables it for instant popup states', () => {
    const stylesheet = readFileSync('app/globals.css', 'utf8')

    expect(stylesheet).toMatch(
      /\.contrib-grid i \{[\s\S]*animation: contrib-cell-in 480ms/,
    )
    expect(stylesheet).toMatch(
      /\.link-card\.preview-card-instant \.contrib-grid i \{\s*animation: none;/,
    )
    expect(stylesheet).toMatch(
      /transition:\s*opacity 200ms var\(--ease-swift\),\s*transform 200ms var\(--ease-swift\);/,
    )
    expect(stylesheet).not.toMatch(
      /\.link-card \{[^}]*transition:[^}]*(?:width|height)/,
    )
  })
})
