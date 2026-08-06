'use client'

import { useEffect, useRef } from 'react'

const MOBILE_CELL = 2 // denser mobile screen keeps facial features legible
const DESKTOP_CELL = 3 // CSS px between dot centers
const MOBILE_PRESENTATION_MAX = 200
const EDGE_FADE = 0.1 // fraction of each edge over which dots taper out
const RADIUS = 150 // pointer influence radius (CSS px)
const SWELL = 0.08 // max extra dot growth near the pointer
const PUSH = 3 // max dot displacement away from the pointer (CSS px)

interface Cell {
  x: number
  y: number
  red: number
  green: number
  blue: number
  alpha: number
}

interface Field {
  cells: Cell[]
  cell: number
}

// Renders one full-colour source image as an interactive halftone portrait.
// A fine pointer swells and repels dots. Touch and reduced-motion devices
// receive the same static colour print without pointer animation.
export function HalftonePortrait({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const maybeWrapper = wrapperRef.current
    const maybeCanvas = canvasRef.current
    
    if (!maybeWrapper || !maybeCanvas) return

    const wrapper = maybeWrapper
    const canvas = maybeCanvas
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    
    if (!ctx) return

    let cssW = 0
    let cssH = 0
    let raf = 0
    let field: Field | undefined
    let image: HTMLImageElement | undefined

    const pointer = { x: -1e4, y: -1e4 }
    const target = { x: -1e4, y: -1e4 }
    let pointerActive = false

    const interactive =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function buildField() {
      if (!image || cssW < 4 || cssH < 4) return

      const cell = cssW < MOBILE_PRESENTATION_MAX ? MOBILE_CELL : DESKTOP_CELL
      const cols = Math.max(1, Math.round(cssW / cell))
      const rows = Math.max(1, Math.round(cssH / cell))

      const offscreen = document.createElement('canvas')
      offscreen.width = cols
      offscreen.height = rows

      const offscreenCtx = offscreen.getContext('2d', {
        willReadFrequently: true,
      })
      if (!offscreenCtx) return

      // Cover-crop the source image into the canvas dimensions.
      const scale = Math.max(cols / image.naturalWidth, rows / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale

      offscreenCtx.drawImage(
        image,
        (cols - drawWidth) / 2,
        (rows - drawHeight) / 2,
        drawWidth,
        drawHeight,
      )

      const data = offscreenCtx.getImageData(0, 0, cols, rows).data
      const cells: Cell[] = []

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < cols; column++) {
          const pixelIndex = (row * cols + column) * 4
          const sourceAlpha = data[pixelIndex + 3] / 255
          if (sourceAlpha < 0.05) continue

          const x = (column + 0.5) * cell
          const y = (row + 0.5) * cell
          const fadeX = Math.min(x, cssW - x) / (cssW * EDGE_FADE)
          const fadeY = Math.min(y, cssH - y) / (cssH * EDGE_FADE)
          const edgeAlpha = Math.min(1, fadeX, fadeY)
          const alpha = sourceAlpha * edgeAlpha

          if (alpha <= 0) continue

          cells.push({
            x,
            y,
            red: data[pixelIndex],
            green: data[pixelIndex + 1],
            blue: data[pixelIndex + 2],
            alpha,
          })
        }
      }

      field = { cell, cells }
    }

    function draw() {
      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cssW, cssH)

      if (!field) return

      const maxRadius = field.cell * 0.52
      let painted = false

      for (const cell of field.cells) {
        let { x, y } = cell
        let radius = maxRadius

        if (pointerActive || pointer.x > -1e3) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          const distance = Math.hypot(dx, dy)

          if (distance < RADIUS) {
            const progress = 1 - distance / RADIUS
            const falloff = progress * progress * (3 - 2 * progress)
            radius *= 1 + SWELL * falloff

            const displacement = (PUSH * falloff) / (distance || 1)
            x += dx * displacement
            y += dy * displacement
          }
        }

        ctx.globalAlpha = cell.alpha
        ctx.fillStyle = `rgb(${cell.red} ${cell.green} ${cell.blue})`
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
        painted = true
      }

      ctx.globalAlpha = 1

      if (painted && !wrapper.hasAttribute('data-ready')) {
        wrapper.dataset.ready = ''
      }
    }

    function tick() {
      raf = 0

      const dx = target.x - pointer.x
      const dy = target.y - pointer.y
      pointer.x += dx * 0.16
      pointer.y += dy * 0.16

      draw()

      if (pointerActive || Math.hypot(dx, dy) > 0.5) {
        raf = requestAnimationFrame(tick)
      }
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    function layout() {
      const rect = canvas.getBoundingClientRect()
      cssW = rect.width
      cssH = rect.height

      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)

      buildField()
      draw()
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      target.x = event.clientX - rect.left
      target.y = event.clientY - rect.top
      pointerActive = true
      wake()
    }

    const onLeave = () => {
      pointerActive = false
      target.x = -1e4
      target.y = -1e4
      wake()
    }

    if (interactive) {
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerleave', onLeave)
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    const onLoad = () => {
      image = img
      buildField()
      draw()
    }

    if (img.complete && img.naturalWidth > 0) onLoad()
    else img.addEventListener('load', onLoad, { once: true })

    const resizeObserver = new ResizeObserver(layout)
    resizeObserver.observe(canvas)

    return () => {
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      img.removeEventListener('load', onLoad)
      resizeObserver.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [src])

  return (
    <span ref={wrapperRef} className={className} data-halftone>
      {/* Preload the single colour source without showing the raw image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={1000}
        height={1000}
        crossOrigin="anonymous"
        hidden
        aria-hidden
      />
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        className="halftone-canvas"
      />
    </span>
  )
}