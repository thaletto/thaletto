'use client'

import { type CSSProperties, useEffect, useMemo, useRef } from 'react'
import { getMarkerHeight } from './lifeline-utils'
import type { LifelineMarker, LifelineMode } from './types'
import { useLifelineIntro } from './use-lifeline-intro'
import { useLifelineVerticalScroll } from './use-lifeline-vertical-scroll'

/** Avoid promoting every entry to a compositor layer on long timelines. */
const MAX_ARMED_ENTRIES = 80

export function useLifelineVerticalController({
  markers,
  mode,
}: {
  markers: LifelineMarker[]
  mode: LifelineMode
}) {
  const isEmbed = mode === 'embed'
  const heights = useMemo(
    () => markers.map((marker, index) => getMarkerHeight(marker, markers[index + 1]?.year)),
    [markers],
  )
  const intro = useLifelineIntro(heights)
  const isIntroAnimating = intro.shouldPlay && intro.isPlaying
  const { sectionRef, setEntryRef, isLayoutReady } = useLifelineVerticalScroll(markers.length, {
    isEmbed,
    introLocked: isIntroAnimating,
    introAnimating: isIntroAnimating,
    introSkipped: !intro.shouldPlay || isEmbed,
    introRailMs: intro.railDuration,
    introGetTrackProgress: intro.getTrackProgressAtTime,
    onIntroScrollStart: intro.startIntroTimer,
    onIntroSettleComplete: intro.completeIntro,
  })

  const showIntro = isIntroAnimating && isLayoutReady && !isEmbed
  const revealOnScroll = markers.length > MAX_ARMED_ENTRIES
  const introStyle = {
    '--lifeline-labels-ms': `${intro.labelsDuration}ms`,
    '--lifeline-rail-ms': `${intro.railDuration}ms`,
  } as CSSProperties

  const scrolledToPresent = useRef(false)
  useEffect(() => {
    if (!isLayoutReady || scrolledToPresent.current || !isEmbed) return
    scrolledToPresent.current = true

    const last = sectionRef.current?.querySelector('li:last-child')
    if (!last) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    last.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' })
  }, [isEmbed, isLayoutReady, sectionRef])

  return {
    sectionRef,
    setEntryRef,
    isLayoutReady,
    showIntro,
    revealOnScroll,
    introStyle,
    entryAnimation(index: number) {
      return {
        animateIntro: showIntro && !revealOnScroll,
        revealPending: showIntro && revealOnScroll,
        introDelay: intro.getMarkerDelay(index),
        introDuration: intro.getMarkerFadeDuration(index),
      }
    },
  }
}
