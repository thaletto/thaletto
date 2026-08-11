'use client'

import { type CSSProperties, type PointerEvent, useRef, useState } from 'react'
import { cn } from '~/lib/platform/utils'
import { LifelineEventMedia } from './lifeline-event'
import { LifelineLightbox, type LifelineLightboxStart } from './lifeline-lightbox'
import type { LifelinePhoto } from './types'

/** Pointer travel below this is a click (opens the lightbox), not a drag. */
const CLICK_SLOP = 4
/** Fingers wobble more than mice — touch presses get extra tap room. */
const TOUCH_CLICK_SLOP = 10

/**
 * The interactive photo card, positioning-agnostic: drag moves it for
 * the session, a press without travel expands it into the lightbox.
 * The vertical layout drops it into normal flow.
 */
export function LifelinePhotoCard({
  photo,
  rotate,
  width,
  className,
  style,
  animateIntro = false,
  introDelay = 0,
  introDuration = 420,
}: {
  photo: LifelinePhoto
  /** Resolved resting tilt, degrees. */
  rotate: number
  width: number
  /** Positioning context from the caller (e.g. "absolute"). */
  className?: string
  style?: CSSProperties
  animateIntro?: boolean
  introDelay?: number
  introDuration?: number
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const [lightboxStart, setLightboxStart] = useState<LifelineLightboxStart | null>(null)
  const cardRef = useRef<HTMLButtonElement>(null)
  const drag = useRef({
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
    moved: false,
    slop: CLICK_SLOP,
  })

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    // A card drag must not reach the surrounding timeline.
    event.stopPropagation()
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: offset.x,
      baseY: offset.y,
      moved: false,
      slop: event.pointerType === 'touch' ? TOUCH_CLICK_SLOP : CLICK_SLOP,
    }
    setActive(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!active) return
    const dx = event.clientX - drag.current.startX
    const dy = event.clientY - drag.current.startY
    if (Math.hypot(dx, dy) > drag.current.slop) drag.current.moved = true
    setOffset({ x: drag.current.baseX + dx, y: drag.current.baseY + dy })
  }

  // The card's real geometry: bounding-box center (rotation preserves
  // it) plus untransformed layout size — never the rotated hull, which
  // is what made the lightbox clone jump on open.
  const measureCard = (): LifelineLightboxStart | null => {
    const el = cardRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    // Recover the rendered scale (hover grows the card 3%) from the
    // rotated hull: for tilt θ, hullWidth = (w·cosθ + h·sinθ)·scale.
    const w0 = el.offsetWidth
    const h0 = el.offsetHeight
    const rad = Math.abs((rotate * Math.PI) / 180)
    const hull = w0 * Math.cos(rad) + h0 * Math.sin(rad)
    const scale = hull > 0 ? rect.width / hull : 1
    return {
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
      w: w0 * scale,
      h: h0 * scale,
      mediaTime: el.querySelector('video')?.currentTime,
    }
  }

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId)
    setActive(false)
    // A press that never travelled is a click — expand to the lightbox.
    if (!drag.current.moved && !lightboxStart) {
      setLightboxStart(measureCard())
    }
  }

  // The browser claiming the gesture (a vertical pan-y scroll on
  // touch) is not a click — reset without opening.
  const onPointerCancel = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId)
    setActive(false)
    setOffset({ x: drag.current.baseX, y: drag.current.baseY })
  }

  return (
    <>
      <button
        type="button"
        ref={cardRef}
        data-lifeline-interactive=""
        aria-label={`Open ${photo.alt}`}
        className={cn(
          // pan-y keeps page scrolling alive on touch: a vertical swipe
          // starting on a card scrolls the timeline (the browser claims
          // the gesture and fires pointercancel); horizontal drags move
          // the card.
          'group/photo pointer-events-auto cursor-grab touch-pan-y border-0 bg-transparent p-0 text-left',
          active ? 'z-50 cursor-grabbing' : 'z-20 hover:z-40',
          lightboxStart && 'invisible',
          className,
        )}
        style={
          {
            ...style,
            width,
            transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg)`,
          } as CSSProperties
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return
          event.preventDefault()
          if (!lightboxStart) setLightboxStart(measureCard())
        }}
      >
        <div
          className={cn(
            'overflow-hidden rounded-xl shadow-xl ring-1 ring-black/10 transition-[transform,box-shadow] duration-200 ease-out dark:ring-white/15',
            animateIntro && 'lifeline-marker-intro',
            active
              ? 'scale-[1.05] shadow-2xl'
              : 'group-hover/photo:scale-[1.03] group-hover/photo:shadow-2xl',
          )}
          style={
            animateIntro
              ? ({
                  animationDelay: `${introDelay}ms`,
                  '--lifeline-marker-fade-ms': `${introDuration}ms`,
                } as CSSProperties)
              : undefined
          }
        >
          <LifelineEventMedia media={photo} className="pointer-events-none block w-full" />
        </div>
      </button>
      {lightboxStart && (
        <LifelineLightbox
          photo={photo}
          rotate={rotate}
          start={lightboxStart}
          getHome={measureCard}
          onClosed={() => setLightboxStart(null)}
        />
      )}
    </>
  )
}
