import { play, setEnabled } from 'cuelume'

// UI sound preference + semantic cues from Cuelume. An explicit preference
// lives in localStorage; the library only owns synthesis and playback.

let engineDisableTimer: ReturnType<typeof setTimeout> | undefined
let inMemorySoundEnabled = true

export function soundEnabled(): boolean {
  try {
    const preference = localStorage.getItem('sound')
    return preference === null ? inMemorySoundEnabled : preference === 'on'
  } catch {
    return inMemorySoundEnabled
  }
}

export function setSoundEnabled(on: boolean) {
  inMemorySoundEnabled = on
  try {
    localStorage.sound = on ? 'on' : 'off'
  } catch {
    /* private mode */
  }

  if (engineDisableTimer !== undefined) {
    clearTimeout(engineDisableTimer)
    engineDisableTimer = undefined
  }

  if (on) {
    setEnabled(true)
    return
  }

  // Let the final preference cue start after a suspended AudioContext resumes.
  // Updating storage first prevents any later interaction from starting a cue.
  engineDisableTimer = setTimeout(() => {
    setEnabled(false)
    engineDisableTimer = undefined
  }, 350)
}

function playCue(cue: 'chime' | 'droplet' | 'sparkle' | 'success') {
  const enabled = soundEnabled()
  setEnabled(enabled)
  if (enabled) play(cue)
}

export function playDockSound() {
  playCue('chime')
}

export function playPreferenceSound() {
  playCue('success')
}

export function playCoverSound(on: boolean) {
  playCue(on ? 'sparkle' : 'droplet')
}
