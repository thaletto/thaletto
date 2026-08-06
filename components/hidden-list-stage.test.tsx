// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ProjectsBlueprintStage, WritingInkStage } from './hidden-list-stage'

vi.mock('next/dynamic', () => ({
  default: () =>
    function ShaderFieldBoundary({
      onUnavailable,
      onReady,
    }: {
      onUnavailable: () => void
      onReady: () => void
    }) {
      return (
        <span data-shader-boundary>
          <button type="button" data-shader-ready onClick={onReady}>
            Mark ready
          </button>
          <button type="button" data-shader-unavailable onClick={onUnavailable}>
            Mark unavailable
          </button>
        </span>
      )
    },
}))

function setMediaPreferences({
  finePointer = true,
  reducedMotion = false,
}: {
  finePointer?: boolean
  reducedMotion?: boolean
} = {}) {
  let reduce = reducedMotion
  const reducedMotionListeners = new Set<() => void>()

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        if (query === '(prefers-reduced-motion: reduce)') return reduce
        if (query === '(hover: hover) and (pointer: fine)') return finePointer
        return false
      },
      media: query,
      onchange: null,
      addEventListener: vi.fn((_type: string, listener: () => void) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          reducedMotionListeners.add(listener)
        }
      }),
      removeEventListener: vi.fn((_type: string, listener: () => void) => {
        reducedMotionListeners.delete(listener)
      }),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )

  return {
    setReducedMotion(value: boolean) {
      reduce = value
      reducedMotionListeners.forEach((listener) => listener())
    },
  }
}

function enableWebGpu(adapter: unknown | null = {}) {
  const requestAdapter = vi.fn().mockResolvedValue(adapter)
  Object.defineProperty(navigator, 'gpu', {
    configurable: true,
    value: { requestAdapter },
  })
  return requestAdapter
}

function ProjectRows({ onFirstClick }: { onFirstClick?: () => void } = {}) {
  return (
    <div>
      <a
        href="/one"
        data-list-stage-row
        data-list-stage-id="one"
        onClick={(event) => {
          event.preventDefault()
          onFirstClick?.()
        }}
      >
        <span data-list-stage-anchor>One</span>
      </a>
      <a href="/two" data-list-stage-row data-list-stage-id="two">
        <span data-list-stage-anchor>Two</span>
      </a>
    </div>
  )
}

function WritingRows() {
  return (
    <div>
      <a href="/post-one" data-list-stage-row data-list-stage-id="post-one">
        Post one
        <span data-list-stage-target>Leader one</span>
      </a>
      <a href="/post-two" data-list-stage-row data-list-stage-id="post-two">
        Post two
        <span data-list-stage-target>Leader two</span>
      </a>
    </div>
  )
}

async function finishIntent() {
  await act(async () => {
    vi.advanceTimersByTime(120)
    await Promise.resolve()
  })
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  Reflect.deleteProperty(navigator, 'gpu')
})

describe('hidden list shader stages', () => {
  it('reuses the fine-pointer media query across pointer events', () => {
    setMediaPreferences()

    render(
      <ProjectsBlueprintStage>
        <ProjectRows />
      </ProjectsBlueprintStage>,
    )

    const matchMedia = vi.mocked(window.matchMedia)
    const stage = document.querySelector<HTMLElement>(
      '[data-list-stage="projects"]',
    )!
    const first = screen.getByRole('link', { name: 'One' })

    expect(matchMedia).toHaveBeenCalledTimes(2)
    fireEvent.pointerOver(first, { pointerType: 'mouse' })
    fireEvent.pointerOut(first, { pointerType: 'mouse' })
    fireEvent.pointerLeave(stage, { pointerType: 'mouse' })
    expect(matchMedia).toHaveBeenCalledTimes(2)
  })

  it('waits for initial pointer intent and unmounts after the Projects exit', async () => {
    vi.useFakeTimers()
    setMediaPreferences()
    enableWebGpu()

    render(
      <ProjectsBlueprintStage>
        <ProjectRows />
      </ProjectsBlueprintStage>,
    )

    const stage = document.querySelector<HTMLElement>(
      '[data-list-stage="projects"]',
    )!
    const first = screen.getByRole('link', { name: 'One' })
    fireEvent.pointerOver(first, { pointerType: 'mouse' })

    act(() => vi.advanceTimersByTime(119))
    expect(stage.dataset.active).toBe('false')
    expect(document.querySelector('[data-list-shader-stage]')).toBeNull()

    await finishIntent()
    expect(stage.dataset.activeId).toBe('one')
    expect(stage.dataset.motion).toBe('true')
    expect(document.querySelector('[data-list-shader-stage]')).not.toBeNull()
    fireEvent.click(document.querySelector('[data-shader-ready]')!)
    expect(document.querySelector('.projects-blueprint-static')).toBeNull()

    fireEvent.pointerLeave(stage, { pointerType: 'mouse' })
    fireEvent.blur(first)
    expect(stage.dataset.active).toBe('false')
    expect(document.querySelector('[data-list-shader-stage]')).not.toBeNull()

    act(() => vi.advanceTimersByTime(179))
    expect(document.querySelector('[data-list-shader-stage]')).not.toBeNull()
    act(() => vi.advanceTimersByTime(1))
    expect(document.querySelector('[data-list-shader-stage]')).toBeNull()
  })

  it('retargets immediately without remounting the shared runtime', async () => {
    vi.useFakeTimers()
    setMediaPreferences()
    const requestAdapter = enableWebGpu()

    render(
      <ProjectsBlueprintStage>
        <ProjectRows />
      </ProjectsBlueprintStage>,
    )

    const stage = document.querySelector<HTMLElement>(
      '[data-list-stage="projects"]',
    )!
    const first = screen.getByRole('link', { name: 'One' })
    const second = screen.getByRole('link', { name: 'Two' })
    fireEvent.pointerOver(first, { pointerType: 'mouse' })
    await finishIntent()

    const runtime = document.querySelector('[data-shader-boundary]')
    fireEvent.pointerOver(second, {
      pointerType: 'mouse',
      relatedTarget: first,
    })

    expect(stage.dataset.activeId).toBe('two')
    expect(document.querySelector('[data-shader-boundary]')).toBe(runtime)
    expect(requestAdapter).toHaveBeenCalledOnce()
  })

  it('keeps one Writing runtime across rows and uses its faster exit', async () => {
    vi.useFakeTimers()
    setMediaPreferences()
    enableWebGpu()

    render(
      <WritingInkStage>
        <WritingRows />
      </WritingInkStage>,
    )

    const stage = document.querySelector<HTMLElement>(
      '[data-list-stage="writing"]',
    )!
    const first = screen.getByRole('link', { name: /Post one/ })
    const second = screen.getByRole('link', { name: /Post two/ })
    fireEvent.pointerOver(first, { pointerType: 'mouse' })
    await finishIntent()

    const runtime = document.querySelector('[data-shader-boundary]')
    fireEvent.click(document.querySelector('[data-shader-ready]')!)
    expect(document.querySelector('.writing-ink-static')).toBeNull()
    fireEvent.pointerOver(second, {
      pointerType: 'mouse',
      relatedTarget: first,
    })

    expect(stage.dataset.activeId).toBe('post-two')
    expect(document.querySelector('[data-shader-boundary]')).toBe(runtime)

    fireEvent.pointerLeave(stage, { pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(119))
    expect(document.querySelector('[data-list-shader-stage]')).not.toBeNull()
    act(() => vi.advanceTimersByTime(1))
    expect(document.querySelector('[data-list-shader-stage]')).toBeNull()
  })

  it('uses an immediate static treatment for keyboard focus', () => {
    setMediaPreferences()
    const requestAdapter = enableWebGpu()

    render(
      <ProjectsBlueprintStage>
        <ProjectRows />
      </ProjectsBlueprintStage>,
    )

    const stage = document.querySelector<HTMLElement>(
      '[data-list-stage="projects"]',
    )!
    fireEvent.focus(screen.getByRole('link', { name: 'One' }))

    expect(stage.dataset.activeId).toBe('one')
    expect(stage.dataset.motion).toBe('false')
    expect(document.querySelector('.projects-blueprint-static')).not.toBeNull()
    expect(document.querySelector('[data-list-shader-stage]')).toBeNull()
    expect(requestAdapter).not.toHaveBeenCalled()
  })

  it('does not intercept a touch link or reveal a preview', () => {
    setMediaPreferences({ finePointer: false })
    const requestAdapter = enableWebGpu()
    const onFirstClick = vi.fn()

    render(
      <ProjectsBlueprintStage>
        <ProjectRows onFirstClick={onFirstClick} />
      </ProjectsBlueprintStage>,
    )

    const stage = document.querySelector<HTMLElement>(
      '[data-list-stage="projects"]',
    )!
    const first = screen.getByRole('link', { name: 'One' })
    fireEvent.pointerDown(first, { pointerType: 'touch' })
    fireEvent.focus(first)
    fireEvent.pointerOver(first, { pointerType: 'touch' })
    fireEvent.click(first)

    expect(onFirstClick).toHaveBeenCalledOnce()
    expect(stage.dataset.active).toBe('false')
    expect(document.querySelector('.hidden-list-stage-field')).toBeNull()
    expect(requestAdapter).not.toHaveBeenCalled()
  })

  it('keeps reduced-motion pointer attention static', async () => {
    vi.useFakeTimers()
    setMediaPreferences({ reducedMotion: true })
    const requestAdapter = enableWebGpu()

    render(
      <ProjectsBlueprintStage>
        <ProjectRows />
      </ProjectsBlueprintStage>,
    )

    const stage = document.querySelector<HTMLElement>(
      '[data-list-stage="projects"]',
    )!
    fireEvent.pointerOver(screen.getByRole('link', { name: 'One' }), {
      pointerType: 'mouse',
    })
    await finishIntent()

    expect(stage.dataset.activeId).toBe('one')
    expect(stage.dataset.motion).toBe('false')
    expect(document.querySelector('[data-list-shader-stage]')).toBeNull()
    expect(requestAdapter).not.toHaveBeenCalled()
  })

  it('falls back to the static plate when WebGPU has no adapter', async () => {
    vi.useFakeTimers()
    setMediaPreferences()
    const requestAdapter = enableWebGpu(null)

    render(
      <ProjectsBlueprintStage>
        <ProjectRows />
      </ProjectsBlueprintStage>,
    )

    const stage = document.querySelector<HTMLElement>(
      '[data-list-stage="projects"]',
    )!
    fireEvent.pointerOver(screen.getByRole('link', { name: 'One' }), {
      pointerType: 'mouse',
    })
    await finishIntent()

    expect(stage.dataset.activeId).toBe('one')
    expect(stage.dataset.motion).toBe('false')
    expect(document.querySelector('.projects-blueprint-static')).not.toBeNull()
    expect(document.querySelector('[data-list-shader-stage]')).toBeNull()
    expect(requestAdapter).toHaveBeenCalledOnce()
  })

  it('keeps the active row static after shader initialization fails', async () => {
    vi.useFakeTimers()
    setMediaPreferences()
    enableWebGpu()

    render(
      <ProjectsBlueprintStage>
        <ProjectRows />
      </ProjectsBlueprintStage>,
    )

    const stage = document.querySelector<HTMLElement>(
      '[data-list-stage="projects"]',
    )!
    fireEvent.pointerOver(screen.getByRole('link', { name: 'One' }), {
      pointerType: 'mouse',
    })
    await finishIntent()
    fireEvent.click(document.querySelector('[data-shader-unavailable]')!)

    expect(stage.dataset.activeId).toBe('one')
    expect(stage.dataset.motion).toBe('false')
    expect(document.querySelector('.projects-blueprint-static')).not.toBeNull()
    expect(document.querySelector('[data-list-shader-stage]')).toBeNull()
  })

  it('positions the Writing treatment on the active dotted-leader lane', () => {
    setMediaPreferences()
    enableWebGpu()

    render(
      <WritingInkStage>
        <a href="/post" data-list-stage-row data-list-stage-id="post">
          Post
          <span data-list-stage-target>Leader</span>
        </a>
      </WritingInkStage>,
    )

    const stage = document.querySelector<HTMLElement>(
      '[data-list-stage="writing"]',
    )!
    const target = document.querySelector<HTMLElement>(
      '[data-list-stage-target]',
    )!
    vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue({
      x: 10,
      y: 20,
      left: 10,
      top: 20,
      right: 410,
      bottom: 220,
      width: 400,
      height: 200,
      toJSON: () => ({}),
    })
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      x: 110,
      y: 70,
      left: 110,
      top: 70,
      right: 290,
      bottom: 71,
      width: 180,
      height: 1,
      toJSON: () => ({}),
    })

    fireEvent.focus(screen.getByRole('link', { name: /Post/ }))

    expect(stage.dataset.activeId).toBe('post')
    expect(stage.dataset.motion).toBe('false')
    expect(stage.style.getPropertyValue('--list-stage-target-x')).toBe('100px')
    expect(stage.style.getPropertyValue('--list-stage-target-y')).toBe('44.5px')
    expect(stage.style.getPropertyValue('--list-stage-target-width')).toBe(
      '180px',
    )
    expect(stage.style.getPropertyValue('--list-stage-target-height')).toBe(
      '12px',
    )
    expect(document.querySelector('.writing-ink-static')).not.toBeNull()
    expect(document.querySelector('[data-list-shader-stage]')).toBeNull()
  })
})
