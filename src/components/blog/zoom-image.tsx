'use client'

import Image, { type ImageLoader } from 'next/image'
import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const VIEWPORT_PAD = 32
const DEFAULT_ROOT_FONT_SIZE = 16
const DETAIL_SPACE_REM = 4.5
const MOBILE_DETAIL_SPACE_REM = 7
const MOBILE_BREAKPOINT_REM = 40

type ZoomImageRendition = { src: string; width: number }
function rootFontSizePixels() {
  const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  return Number.isFinite(rootFontSize) ? rootFontSize : DEFAULT_ROOT_FONT_SIZE
}

interface ZoomImageProps {
  src: string
  alt: string
  width: number
  height: number
  sizes?: string
  className?: string
  style?: React.CSSProperties
  renditions?: ReadonlyArray<ZoomImageRendition>
  expandedContent?: React.ReactNode
}

function largestRendition(renditions: ZoomImageProps['renditions']) {
  return renditions?.reduce<ZoomImageRendition | undefined>(
    (largest, rendition) => (!largest || rendition.width > largest.width ? rendition : largest),
    undefined,
  )
}

function renditionForWidth(renditions: ZoomImageProps['renditions'], requestedWidth: number) {
  return renditions?.reduce<ZoomImageRendition | undefined>(
    (best, rendition) =>
      rendition.width >= requestedWidth && (!best || rendition.width < best.width)
        ? rendition
        : best,
    undefined,
  )
}

// Click-to-zoom for post images: the photo appears over a dimmed sheet.
// Esc / click / scroll puts it back down.
export function ZoomImage({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  style,
  renditions,
  expandedContent,
}: ZoomImageProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const preloadedSrcRef = useRef<string | null>(null)
  const [zoom, setZoom] = useState<{
    expandedSrc: string
    target: { left: number; top: number; width: number; height: number }
  } | null>(null)

  const expandedSrc = largestRendition(renditions)?.src ?? src
  // Next Image owns responsive selection and layout, while Bunny remains the
  // encoder/cache layer. Selecting an immutable Rendition here avoids a second
  // quality pass through Next's optimizer.
  const renditionLoader = useCallback<ImageLoader>(
    ({ width: requestedWidth }) =>
      renditionForWidth(renditions, requestedWidth)?.src ?? expandedSrc,
    [expandedSrc, renditions],
  )

  const preloadExpanded = useCallback(() => {
    if (expandedSrc === src || preloadedSrcRef.current === expandedSrc) return
    const preload = document.createElement('img')
    preload.decoding = 'async'
    preload.src = expandedSrc
    preloadedSrcRef.current = expandedSrc
  }, [expandedSrc, src])

  const unmount = useCallback(() => {
    setZoom(null)
    triggerRef.current?.focus({ preventScroll: true })
  }, [])

  const open = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      // Fit within the viewport but never beyond the intrinsic size —
      // zoom means "actual size", not "stretch".
      const maxW = Math.min(window.innerWidth - VIEWPORT_PAD * 2, width)
      const rootFontSize = rootFontSizePixels()
      const detailSpace = expandedContent
        ? (window.innerWidth < MOBILE_BREAKPOINT_REM * rootFontSize
            ? MOBILE_DETAIL_SPACE_REM
            : DETAIL_SPACE_REM) * rootFontSize
        : 0
      const maxH = Math.max(
        1,
        Math.min(window.innerHeight - VIEWPORT_PAD * 2 - detailSpace, height),
      )
      const scale = Math.min(maxW / width, maxH / height)
      const w = Math.round(width * scale)
      const h = Math.round(height * scale)
      setZoom({
        expandedSrc,
        target: {
          left: Math.round((window.innerWidth - w) / 2),
          top: Math.round((window.innerHeight - detailSpace - h) / 2),
          width: w,
          height: h,
        },
      })
    },
    [expandedSrc, width, height, expandedContent],
  )

  const close = useCallback(() => {
    unmount()
  }, [unmount])

  useEffect(() => {
    if (!zoom) return
    overlayRef.current?.focus({ preventScroll: true })
  }, [zoom])

  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
      // image-only dialog: the overlay is the sole focusable — keep Tab inside
      if (e.key === 'Tab') e.preventDefault()
    }
    // A scroll gesture still dismisses the print, but never moves the page:
    // the sheet stays frozen while the photo is up.
    const onGesture = (e: Event) => {
      e.preventDefault()
      close()
    }
    // Scrolls that bypass wheel/touch (keyboard, scrollbar drag) still close.
    const onViewportChange = () => close()
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onGesture, { passive: false })
    window.addEventListener('touchmove', onGesture, { passive: false })
    window.addEventListener('scroll', onViewportChange)
    window.addEventListener('resize', onViewportChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onGesture)
      window.removeEventListener('touchmove', onGesture)
      window.removeEventListener('scroll', onViewportChange)
      window.removeEventListener('resize', onViewportChange)
    }
  }, [zoom, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="zoom-trigger"
        style={style}
        aria-label={alt ? `Zoom image: ${alt}` : 'Zoom image'}
        data-zoomed={zoom ? '' : undefined}
        onPointerEnter={preloadExpanded}
        onFocus={preloadExpanded}
        onClick={open}
      >
        <Image
          loader={renditions ? renditionLoader : undefined}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={className}
        />
      </button>
      {zoom &&
        createPortal(
          <div
            ref={overlayRef}
            tabIndex={-1}
            className="zoom-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={alt || 'Image'}
            onClick={() => close()}
          >
            <div className="zoom-overlay-backdrop" />
            <Image
              unoptimized
              src={zoom.expandedSrc}
              alt={alt}
              width={width}
              height={height}
              loading="eager"
              fetchPriority="high"
              style={{
                left: zoom.target.left,
                top: zoom.target.top,
                width: zoom.target.width,
                height: zoom.target.height,
              }}
            />
            <div
              aria-hidden
              className="zoom-overlay-marks calibration-corners"
              style={
                {
                  left: zoom.target.left - 10,
                  top: zoom.target.top - 10,
                  width: zoom.target.width + 20,
                  height: zoom.target.height + 20,
                  '--corner-arm': '11px',
                } as React.CSSProperties
              }
            />
            {expandedContent && <div className="zoom-overlay-details">{expandedContent}</div>}
          </div>,
          document.body,
        )}
    </>
  )
}
