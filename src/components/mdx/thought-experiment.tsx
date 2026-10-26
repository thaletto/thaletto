'use client'

import { useEffect, useRef, useState, type PropsWithChildren } from 'react'

const DURATION_MS = 8000

const ASSOCIATIONS: ReadonlyArray<{ at: number; tag: string }> = [
  { at: 0, tag: 'Ford Mustang' },
  { at: 2, tag: 'Knight' },
  { at: 4, tag: 'Ferrari' },
  { at: 6, tag: '🐴' },
]

function associationFor(ms: number) {
  let tag = ''
  for (const { at, tag: next } of ASSOCIATIONS) {
    if (ms / 1000 >= at) tag = next
  }
  return tag
}

type Phase = 'ready' | 'playing' | 'paused' | 'complete'

const CONTROL: Record<Phase, { label: string; ariaLabel: string }> = {
  ready: { label: 'Play', ariaLabel: 'Start the eight-second experiment' },
  playing: { label: 'Pause', ariaLabel: 'Pause the countdown' },
  paused: { label: 'Play', ariaLabel: 'Resume the countdown' },
  complete: { label: 'Replay', ariaLabel: 'Replay the experiment' },
}

const CONTINUATION_DELAY_MS = 900

type AudioKit = { tick: () => void; chime: () => void }

async function buildAudioKit(): Promise<AudioKit> {
  const Tone = await import('tone')
  // Browsers only unlock the audio clock inside a user gesture.
  await Tone.start()
  const tickSynth = new Tone.Synth({
    envelope: { attack: 0.001, decay: 0.06, release: 0.02, sustain: 0 },
    oscillator: { type: 'sine' },
  }).toDestination()
  tickSynth.volume.value = -18
  const chimeSynth = new Tone.PolySynth({
    options: {
      envelope: { attack: 0.02, decay: 1.4, release: 0.9, sustain: 0 },
      oscillator: { type: 'sine' },
    },
  }).toDestination()
  chimeSynth.volume.value = -12
  return {
    tick: () => tickSynth.triggerAttackRelease('E6', 0.02),
    chime: () => chimeSynth.triggerAttackRelease(['A4', 'C#5', 'E5'], 1.6),
  }
}

export function ThoughtExperiment({ children }: PropsWithChildren) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [elapsed, setElapsed] = useState(0)
  const [continuationShown, setContinuationShown] = useState(false)
  const elapsedRef = useRef(0)
  const audioRef = useRef<AudioKit | null>(null)

  useEffect(() => {
    if (phase !== 'playing') return undefined
    let alive = true
    const anchor = performance.now() - elapsedRef.current

    const step = (now: number) => {
      if (!alive) return
      const nextElapsed = Math.min(DURATION_MS, now - anchor)
      if (Math.floor(nextElapsed / 1000) > Math.floor(elapsedRef.current / 1000)) {
        audioRef.current?.tick()
      }
      elapsedRef.current = nextElapsed
      setElapsed(nextElapsed)
      if (nextElapsed < DURATION_MS) {
        requestAnimationFrame(step)
      } else {
        setPhase('complete')
      }
    }

    requestAnimationFrame(step)
    return () => {
      alive = false
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'complete') return undefined
    audioRef.current?.chime()
    const timer = setTimeout(() => setContinuationShown(true), CONTINUATION_DELAY_MS)
    return () => clearTimeout(timer)
  }, [phase])

  const toggle = () => {
    if (phase === 'playing') {
      setPhase('paused')
      return
    }
    if (phase === 'complete') {
      elapsedRef.current = 0
      setElapsed(0)
      setContinuationShown(false)
    }
    void buildAudioKit().then((kit) => {
      audioRef.current = kit
    })
    setPhase('playing')
  }

  const remainingMs = DURATION_MS - elapsed
  const readout = `${(remainingMs / 1000).toFixed(1)}`
  const secondsLeft = remainingMs / 1000
  const finalSecond = secondsLeft > 0 && secondsLeft <= 1
  const association = phase === 'playing' || phase === 'paused' ? associationFor(elapsed) : ''
  const control = CONTROL[phase]

  return (
    <section
      aria-label="An eight-second thought experiment"
      className="thought-experiment"
      data-final={finalSecond || undefined}
      data-phase={phase}
    >
      <p className="thought-prompt">
        For the next <span className="thought-readout">{readout}</span> seconds, don’t think about a{' '}
        <em>horse</em>.
      </p>

      <span
        aria-hidden
        className="thought-rule"
        style={{ transform: `scaleX(${remainingMs / DURATION_MS})` }}
      />

      {association ? (
        <p aria-hidden className="thought-association" key={association}>
          {association}
        </p>
      ) : null}

      <div className="thought-controls">
        <button
          aria-label={control.ariaLabel}
          className="thought-button"
          onClick={toggle}
          type="button"
        >
          {phase === 'playing' ? (
            <svg
              aria-hidden
              className="thought-button-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg>
          ) : phase === 'complete' ? (
            <svg
              aria-hidden
              className="thought-button-icon"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          ) : (
            <svg
              aria-hidden
              className="thought-button-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          <span>{control.label}</span>
        </button>
      </div>

      <div className="thought-reveal">
        <div className="thought-reveal-clip">
          <p className="thought-reveal-line">
            <span className="thought-reveal-kicker">Now be honest.</span> Did you think of a{' '}
            <em>horse</em>?
          </p>
        </div>
      </div>

      {children ? (
        <div
          aria-hidden={!continuationShown}
          className="thought-continuation"
          data-shown={continuationShown || undefined}
        >
          <div className="thought-continuation-clip">{children}</div>
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {phase === 'complete' ? 'Now be honest. Did you think of a horse?' : association}
      </p>
    </section>
  )
}
