'use client'

import dynamic from 'next/dynamic'
import {
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useWebGpuCapability } from '~/components/use-webgpu-capability'

const ProjectsBlueprintField = dynamic(
  () =>
    import('./projects-blueprint-field').then(
      (module) => module.ProjectsBlueprintField,
    ),
  { ssr: false },
)

const WritingInkField = dynamic(
  () => import('./writing-ink-field').then((module) => module.WritingInkField),
  { ssr: false },
)

const ROW_SELECTOR = '[data-list-stage-row]'
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const INITIAL_INTENT_MS = 120
const WRITING_LANE_HEIGHT = 12

type StageVariant = 'projects' | 'writing'

const STAGE_CONFIG = {
  projects: {
    exitMs: 180,
    initialHeight: 0,
    targetSelector: '[data-list-stage-anchor]',
  },
  writing: {
    exitMs: 120,
    initialHeight: WRITING_LANE_HEIGHT,
    targetSelector: '[data-list-stage-target]',
  },
} as const satisfies Record<
  StageVariant,
  { exitMs: number; initialHeight: number; targetSelector: string }
>

type StageGeometry = {
  x: number
  y: number
  width: number
  height: number
}

type StageStyle = CSSProperties & {
  '--list-stage-target-x': string
  '--list-stage-target-y': string
  '--list-stage-target-width': string
  '--list-stage-target-height': string
  '--list-stage-exit-ms': string
}

function rowFromTarget(root: HTMLElement | null, target: EventTarget | null) {
  if (!root || !(target instanceof Element)) return null
  const row = target.closest<HTMLElement>(ROW_SELECTOR)
  return row && root.contains(row) ? row : null
}

function rowId(row: HTMLElement | null) {
  return row?.dataset.listStageId ?? null
}

function stageClassName(variant: StageVariant, className?: string) {
  return [`hidden-list-stage`, `${variant}-hidden-stage`, className]
    .filter(Boolean)
    .join(' ')
}

function HiddenListStage({
  children,
  className,
  contentClassName,
  variant,
}: Readonly<{
  children: React.ReactNode
  className?: string
  contentClassName?: string
  variant: StageVariant
}>) {
  const config = STAGE_CONFIG[variant]
  const rootRef = useRef<HTMLDivElement>(null)
  const activeRow = useRef<HTMLElement | null>(null)
  const hoveredRow = useRef<HTMLElement | null>(null)
  const keyboardRow = useRef<HTMLElement | null>(null)
  const pointerIntentReady = useRef(false)
  const pointerFocusSuppressed = useRef(false)
  const finePointer = useRef<MediaQueryList | null>(null)
  const reducedMotion = useRef(false)
  const motionActive = useRef(false)
  const mounted = useRef(true)
  const intentTimer = useRef<number | undefined>(undefined)
  const exitTimer = useRef<number | undefined>(undefined)
  const {
    check: checkWebGpu,
    markUnavailable: markWebGpuUnavailable,
    supported: webGpuSupported,
  } = useWebGpuCapability()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [motionEnabled, setMotionEnabled] = useState(false)
  const [shaderMounted, setShaderMounted] = useState(false)
  const [shaderReady, setShaderReady] = useState(false)
  const [geometry, setGeometry] = useState<StageGeometry>({
    x: 0,
    y: 0,
    width: 0,
    height: config.initialHeight,
  })

  const clearIntentTimer = useCallback(() => {
    if (intentTimer.current !== undefined)
      window.clearTimeout(intentTimer.current)
    intentTimer.current = undefined
  }, [])

  const clearExitTimer = useCallback(() => {
    if (exitTimer.current !== undefined) window.clearTimeout(exitTimer.current)
    exitTimer.current = undefined
  }, [])

  const measureRow = useCallback(
    (row: HTMLElement) => {
      const root = rootRef.current
      const target = row.querySelector<HTMLElement>(config.targetSelector)
      if (!root || !target) return

      const rootRect = root.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()

      if (variant === 'projects') {
        setGeometry({
          x: targetRect.left - rootRect.left + targetRect.width / 2,
          y: targetRect.top - rootRect.top + targetRect.height / 2,
          width: targetRect.width,
          height: targetRect.height,
        })
        return
      }

      setGeometry({
        x: targetRect.left - rootRect.left,
        y:
          targetRect.top -
          rootRect.top +
          targetRect.height / 2 -
          WRITING_LANE_HEIGHT / 2,
        width: targetRect.width,
        height: WRITING_LANE_HEIGHT,
      })
    },
    [config, variant],
  )

  const setStageRow = useCallback(
    (row: HTMLElement | null) => {
      activeRow.current = row
      setActiveId(rowId(row))
      if (row) measureRow(row)
    },
    [measureRow],
  )

  const syncStage = useCallback(() => {
    const pointerRow = pointerIntentReady.current ? hoveredRow.current : null
    const nextRow = pointerRow ?? keyboardRow.current

    if (!nextRow) {
      if (exitTimer.current !== undefined && !reducedMotion.current) return

      const shouldFade = motionActive.current && !reducedMotion.current
      motionActive.current = false
      setStageRow(null)
      clearExitTimer()

      if (!shouldFade) {
        setShaderMounted(false)
        setShaderReady(false)
        setMotionEnabled(false)
        return
      }

      setMotionEnabled(true)
      exitTimer.current = window.setTimeout(
        () => {
          setShaderMounted(false)
          setShaderReady(false)
          setMotionEnabled(false)
        },
        config.exitMs,
      )
      return
    }

    clearExitTimer()
    setStageRow(nextRow)

    const wantsMotion =
      pointerRow !== null &&
      !reducedMotion.current &&
      webGpuSupported.current !== false

    if (!wantsMotion) {
      motionActive.current = false
      setShaderMounted(false)
      setShaderReady(false)
      setMotionEnabled(false)
      return
    }

    if (webGpuSupported.current === null) {
      motionActive.current = false
      setShaderMounted(false)
      setShaderReady(false)
      setMotionEnabled(false)
      void checkWebGpu().then(() => {
        if (mounted.current) syncStage()
      })
      return
    }

    motionActive.current = true
    setMotionEnabled(true)
    setShaderMounted(true)
  }, [checkWebGpu, clearExitTimer, config, setStageRow])

  const markShaderUnavailable = useCallback(() => {
    markWebGpuUnavailable()
    motionActive.current = false
    setShaderMounted(false)
    setShaderReady(false)
    setMotionEnabled(false)
  }, [markWebGpuUnavailable])

  const markShaderReady = useCallback(() => setShaderReady(true), [])

  useEffect(() => {
    const preference = window.matchMedia(REDUCED_MOTION_QUERY)
    finePointer.current = window.matchMedia(FINE_POINTER_QUERY)
    const updatePreference = () => {
      reducedMotion.current = preference.matches
      syncStage()
    }

    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => {
      finePointer.current = null
      preference.removeEventListener('change', updatePreference)
    }
  }, [syncStage])

  useEffect(() => {
    const row = activeRow.current
    const root = rootRef.current
    if (!activeId || !row || !root) return

    const target = row.querySelector<HTMLElement>(config.targetSelector)
    const update = () => measureRow(row)
    update()
    window.addEventListener('resize', update)

    if (typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', update)
    }

    const observer = new ResizeObserver(update)
    observer.observe(root)
    observer.observe(row)
    if (target) observer.observe(target)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [activeId, config, measureRow])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearIntentTimer()
      clearExitTimer()
    }
  }, [clearExitTimer, clearIntentTimer])

  const isFinePointer = (event: PointerEvent<HTMLElement>) =>
    event.pointerType !== 'touch' && finePointer.current?.matches === true

  const handlePointerOver = (event: PointerEvent<HTMLDivElement>) => {
    if (!isFinePointer(event)) return
    const root = rootRef.current
    const row = rowFromTarget(root, event.target)
    if (!row) return
    if (
      event.relatedTarget instanceof Node &&
      row.contains(event.relatedTarget)
    )
      return

    hoveredRow.current = row
    measureRow(row)
    clearExitTimer()

    if (pointerIntentReady.current) {
      syncStage()
      return
    }

    clearIntentTimer()
    intentTimer.current = window.setTimeout(() => {
      pointerIntentReady.current = true
      syncStage()
    }, INITIAL_INTENT_MS)
  }

  const handlePointerOut = (event: PointerEvent<HTMLDivElement>) => {
    if (!isFinePointer(event) || pointerIntentReady.current) return
    const root = rootRef.current
    const row = rowFromTarget(root, event.target)
    if (
      !row ||
      (event.relatedTarget instanceof Node && row.contains(event.relatedTarget))
    )
      return
    if (rowFromTarget(root, event.relatedTarget)) return

    hoveredRow.current = null
    clearIntentTimer()
  }

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (pointerFocusSuppressed.current) return
    const row = rowFromTarget(rootRef.current, event.target)
    if (!row) return
    keyboardRow.current = row
    syncStage()
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextRow = rowFromTarget(rootRef.current, event.relatedTarget)
    keyboardRow.current = pointerFocusSuppressed.current ? null : nextRow
    syncStage()
  }

  const geometryStyle: StageStyle = {
    '--list-stage-target-x': `${geometry.x}px`,
    '--list-stage-target-y': `${geometry.y}px`,
    '--list-stage-target-width': `${geometry.width}px`,
    '--list-stage-target-height': `${geometry.height}px`,
    '--list-stage-exit-ms': `${config.exitMs}ms`,
  }
  const renderVisual = activeId !== null || shaderMounted

  return (
    <div
      ref={rootRef}
      className={stageClassName(variant, className)}
      data-active={activeId === null ? 'false' : 'true'}
      data-active-id={activeId ?? undefined}
      data-motion={motionEnabled ? 'true' : 'false'}
      data-list-stage={variant}
      style={geometryStyle}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerLeave={(event) => {
        if (!isFinePointer(event)) return
        hoveredRow.current = null
        pointerIntentReady.current = false
        clearIntentTimer()
        syncStage()
      }}
      onPointerDownCapture={() => {
        pointerFocusSuppressed.current = true
      }}
      onPointerCancelCapture={() => {
        pointerFocusSuppressed.current = false
      }}
      onClickCapture={() => {
        pointerFocusSuppressed.current = false
      }}
      onKeyDownCapture={() => {
        pointerFocusSuppressed.current = false
        const row = rowFromTarget(rootRef.current, document.activeElement)
        if (row) {
          keyboardRow.current = row
          syncStage()
        }
      }}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      {renderVisual && (
        <span className="hidden-list-stage-field" aria-hidden>
          {variant === 'projects' ? (
            <>
              {!shaderReady && <span className="projects-blueprint-static" />}
              {shaderMounted && (
                <span
                  className="hidden-list-stage-shader"
                  data-list-shader-stage
                >
                  <ProjectsBlueprintField
                    onUnavailable={markShaderUnavailable}
                    onReady={markShaderReady}
                  />
                </span>
              )}
              <svg
                className="projects-registration-mark"
                viewBox="0 0 20 20"
                fill="none"
              >
                <circle cx="10" cy="10" r="7.4" />
                <path d="M10 0v5M10 15v5M0 10h5M15 10h5" />
              </svg>
            </>
          ) : (
            <span className="writing-ink-current-target">
              {!shaderReady && (
                <svg
                  className="writing-ink-static"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path d="M0 4.1C18 3.3 31 5.1 49 4.2s34-1.2 51-.2" />
                  <path d="M0 6C19 6.8 34 5.1 52 6s30 1.1 48 0" />
                  <path d="M0 7.9C17 8.5 35 7 51 7.8s33 .7 49 .1" />
                </svg>
              )}
              {shaderMounted && (
                <span
                  className="hidden-list-stage-shader"
                  data-list-shader-stage
                >
                  <WritingInkField
                    onUnavailable={markShaderUnavailable}
                    onReady={markShaderReady}
                  />
                </span>
              )}
            </span>
          )}
        </span>
      )}
      <div
        className={['hidden-list-stage-content', contentClassName]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>
  )
}

export function ProjectsBlueprintStage({
  children,
  className,
  contentClassName,
}: Readonly<{
  children: React.ReactNode
  className?: string
  contentClassName?: string
}>) {
  return (
    <HiddenListStage
      variant="projects"
      className={className}
      contentClassName={contentClassName}
    >
      {children}
    </HiddenListStage>
  )
}

export function WritingInkStage({
  children,
  className,
  contentClassName,
}: Readonly<{
  children: React.ReactNode
  className?: string
  contentClassName?: string
}>) {
  return (
    <HiddenListStage
      variant="writing"
      className={className}
      contentClassName={contentClassName}
    >
      {children}
    </HiddenListStage>
  )
}
