import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import {
  getSlowTrackPortion,
  getTransitionMarkerFadeDuration,
  LIFELINE_FAST_MARKER_FADE_MS,
  LIFELINE_SLOW_MARKER_FADE_MS,
  timeAtTrackProgress,
  trackProgressAtTime,
} from './lifeline-intro-timing'

describe('Lifeline intro timing', () => {
  test('maps elapsed time and track progress as inverse operations', () => {
    const heights = [500, 600, 700, 800, 900, 1000, 1100]
    const railMs = 3200

    for (const progress of [0, 0.1, 0.5, 0.9, 1]) {
      const elapsed = timeAtTrackProgress(progress, heights, railMs)
      assert.ok(Math.abs(trackProgressAtTime(elapsed, heights, railMs) - progress) < 0.0001)
    }
  })

  test('keeps the opening years slower and blends marker fades', () => {
    assert.equal(getSlowTrackPortion([10, 10, 10, 10, 10, 50]), 0.5)
    assert.equal(getTransitionMarkerFadeDuration(0), LIFELINE_SLOW_MARKER_FADE_MS)
    assert.equal(getTransitionMarkerFadeDuration(20), LIFELINE_FAST_MARKER_FADE_MS)
    assert.ok(getTransitionMarkerFadeDuration(5) < LIFELINE_SLOW_MARKER_FADE_MS)
    assert.ok(getTransitionMarkerFadeDuration(5) > LIFELINE_FAST_MARKER_FADE_MS)
  })
})
