'use client'

import Image from 'next/image'
import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const VIEWPORT_PAD = 32

interface ZoomImageProps {
  src: string
  alt: string
  width: number
  height: number
  sizes?: string
  className?: string
  style?: React.CSSProperties
}

export function ZoomImage({ src, alt, width, height, sizes, className, style }: ZoomImageProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState<{
    target: { left: number; top: number; width: number; height: number }
  } | null>(null)

  const unmount = useCallback(() => {
    setZoom(null)
    triggerRef.current?.focus({ preventScroll: true })
  }, [])

  const open = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      const maxW = Math.min(window.innerWidth - VIEWPORT_PAD * 2, width)
      const maxH = Math.max(1, Math.min(window.innerHeight - VIEWPORT_PAD * 2, height))
      const scale = Math.min(maxW / width, maxH / height)
      const w = Math.round(width * scale)
      const h = Math.round(height * scale)
      setZoom({
        target: {
          left: Math.round((window.innerWidth - w) / 2),
          top: Math.round((window.innerHeight - h) / 2),
          width: w,
          height: h,
        },
      })
    },
    [width, height],
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
      if (e.key === 'Tab') e.preventDefault()
    }
    const onGesture = (e: Event) => {
      e.preventDefault()
      close()
    }
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
        onClick={open}
      >
        <Image
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
              src={src}
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
          </div>,
          document.body,
        )}
    </>
  )
}
