'use client'

import { useEffect, useRef, useState, type PropsWithChildren } from 'react'

// The opening game of an essay: the reader is asked to suppress a thought for
// eight seconds — an instruction that quietly implies the very thing it bans.
// The component is deliberately window-dressing-light: one instrumented
// sentence, one draining hairline, one quiet control. Nothing explains the
// trick until the readout settles at zero, when the reveal replaces the
// instruction with the confession.
//
// While the countdown runs, the canvas shows one association at a time; each
// holds for two seconds before the next replaces it — Ford Mustang, a
// knight, a Ferrari — a small gallery of horses the sentence forbids.
//
// The countdown runs on a wall-clock frame loop anchored at the last resume,
// so pausing freezes the readout on the exact instant and replaying runs the
// experiment again from zero — you cannot jump, scrub, or skip the eight
// seconds, only let them happen.

const DURATION_MS = 8000

// Each association holds one two-second slot; four slots set the run's
// overall length. An entry prints when its slot opens and keeps the canvas
// until the next one takes over.
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

// One control, four meanings: the label travels with the state so the button
// never lies about what pressing it will do.
const CONTROL: Record<Phase, { label: string; ariaLabel: string }> = {
  ready: { label: 'Play', ariaLabel: 'Start the eight-second experiment' },
  playing: { label: 'Pause', ariaLabel: 'Pause the countdown' },
  paused: { label: 'Play', ariaLabel: 'Resume the countdown' },
  complete: { label: 'Replay', ariaLabel: 'Replay the experiment' },
}

// A beat after the confession, so the punchline lands before the essay moves.
const CONTINUATION_DELAY_MS = 900

// Sound: a soft tick marks each completed second of the countdown and a
// quiet resolving chord announces zero. Tone.js arrives through a dynamic
// import, so it is only fetched when someone actually presses Play — the
// essay pays nothing on first paint, and readers who never play pay for
// nothing at all.
type AudioKit = { tick: () => void; chime: () => void }

async function buildAudioKit(): Promise<AudioKit> {
  const Tone = await import('tone')
  // the Play press is the user gesture that unlocks the audio clock
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
  // Whatever the essay continues with lives inside this component, collapsed
  // until the experiment is over.
  const [continuationShown, setContinuationShown] = useState(false)
  // Mirrors state for the resume anchor, so the frame callback never has to
  // read state: a paused instant stays reusable without extra effects.
  const elapsedRef = useRef(0)
  // The sound kit is built once, on the first play; ticks before it loads
  // are silently dropped.
  const audioRef = useRef<AudioKit | null>(null)

  // One frame loop per playing stretch. The anchor folds the frozen elapsed
  // time back in on resume, which is what makes pause freeze *exactly*.
  useEffect(() => {
    if (phase !== 'playing') return undefined
    let alive = true
    const anchor = performance.now() - elapsedRef.current

    const step = (now: number) => {
      if (!alive) return
      const nextElapsed = Math.min(DURATION_MS, now - anchor)
      // each completed second ticks once; the crossing derives from the same
      // wall clock as the readout, so a paused instant freezes the sound too
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
    // the chord that resolves the countdown, if the kit made it in time
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
      // a replayed run takes the continuation back with it
      setContinuationShown(false)
    }
    // the press itself is the user gesture; the kit builds on the first play
    void buildAudioKit().then((kit) => {
      audioRef.current = kit
    })
    setPhase('playing')
  }

  const remainingMs = DURATION_MS - elapsed
  const readout = `${(remainingMs / 1000).toFixed(1)}`
  const secondsLeft = remainingMs / 1000
  // The final second sharpens its ink — pressure without alarm.
  const finalSecond = secondsLeft > 0 && secondsLeft <= 1
  // Each crossing prints its association only while the clock is alive; the
  // reveal takes the canvas back at zero.
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

      {/* One association per crossing, each a horse in disguise; the key
          remount swaps the text with the small arrival animation. The hints
          live below the timer line, under the draining hairline. */}
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

      {/* The reveal waits collapsed under the prompt until the readout
          settles; the sentence dims instead of leaving, so the confession
          reads as its consequence. */}
      <div className="thought-reveal">
        <div className="thought-reveal-clip">
          <p className="thought-reveal-line">
            <span className="thought-reveal-kicker">Now be honest.</span> Did you think of a{' '}
            <em>horse</em>?
          </p>
        </div>
      </div>

      {/* Essay content placed inside the component waits, collapsed, until
          the run is over; it unfolds a beat after the confession. While
          hidden it is also absent from the accessibility tree. */}
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
