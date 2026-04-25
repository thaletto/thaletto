/**
 * Crossfade Navigation Sounds
 *
 * Provides enter/exit audio feedback that complements React's ViewTransition API.
 * Uses Tone.js with sine oscillators, long-release reverb, and layered tonal step +
 * ripple chord patterns for a soft, spatial, ambient sound character.
 *
 * @module
 * @see {@link https://github.com/anomalyco/thaletto} for usage docs
 */

"use client";

import * as Tone from "tone";
import { markExit } from "./timing";

/**
 * Shared FX nodes, created once and reused across navigations.
 * - reverb: 3.5s decay, 48% wet — long ambient tail
 * - vol: -10dB — keeps audio comfortable
 * - synth: PolySynth with sine oscillators
 */
let reverb: Tone.Reverb | null = null;
let vol: Tone.Volume | null = null;
let synth: Tone.PolySynth | null = null;
let initialized = false;

/**
 * Initializes the audio context and FX chain on first use.
 * Handles browser autoplay policy — requires user interaction before playing.
 * Safe to call on server (noop).
 *
 * @returns True if successfully initialized, false if server-side or failed
 */
async function ensureReady(): Promise<boolean> {
	if (typeof window === "undefined") return false;
	await Tone.start();

	if (!initialized) {
		vol = new Tone.Volume(-10).toDestination();
		reverb = new Tone.Reverb({ decay: 3.5, wet: 0.48 }).connect(vol);
		synth = new Tone.PolySynth(Tone.Synth, {
			oscillator: { type: "sine" },
			envelope: { attack: 0.012, decay: 0.35, sustain: 0.06, release: 2.2 },
		} as Tone.SynthOptions).connect(reverb);
		// Reverb needs a moment to generate its IR
		await reverb.generate();
		initialized = true;
	}

	return true;
}

/**
 * Plays the navigation enter sound.
 *
 * Two-note ascending tonal step (D4 → G4) layered with a slow ripple chord
 * (C4 → E4 → G4 arpeggiated 55ms apart).
 * The tonal step gives immediate directional feedback; the chord bloom gives
 * the ambient tail that outlasts the crossfade.
 *
 * @async
 * @returns Promise that resolves when playback begins
 * @example
 * ```ts
 * await playNavEnter()
 * ```
 */
export async function playNavEnter(): Promise<void> {
	if (!(await ensureReady())) return;

	const now = Tone.now();

	// Tonal step — ascending
	synth!.triggerAttackRelease("D4", "16n", now, 0.38);
	synth!.triggerAttackRelease("G4", "16n", now + 0.09, 0.32);

	// Ripple chord bloom (55 ms between voices)
	synth!.triggerAttackRelease("C4", "8n", now + 0.04, 0.22);
	synth!.triggerAttackRelease("E4", "8n", now + 0.095, 0.16);
	synth!.triggerAttackRelease("G4", "8n", now + 0.15, 0.12);
}

/**
 * Plays the navigation exit sound.
 *
 * Mirror image: descending step (G4 → D4) + reversed ripple (G4 → E4 → C4).
 * Slightly quieter and shorter than the enter sound so it doesn't compete
 * with the enter sound that fires ~300-500ms later during a crossfade.
 * Stamps the exit time in shared state so NavSoundTrigger can delay
 * relative to when the user actually navigated.
 *
 * @async
 * @returns Promise that resolves when playback begins
 * @example
 * ```ts
 * playNavExit() // fire and forget (async, but no need to await)
 * ```
 */
export async function playNavExit(): Promise<void> {
	if (!(await ensureReady())) return;

	// Stamp the moment the user navigated away — NavSoundTrigger
	// delays relative to this, not relative to when pathname resolved.
	markExit();

	const now = Tone.now();

	// Tonal step — descending
	synth!.triggerAttackRelease("G4", "16n", now, 0.3);
	synth!.triggerAttackRelease("D4", "16n", now + 0.09, 0.24);

	// Ripple chord bloom (reversed)
	synth!.triggerAttackRelease("G4", "8n", now + 0.04, 0.16);
	synth!.triggerAttackRelease("E4", "8n", now + 0.095, 0.12);
	synth!.triggerAttackRelease("C4", "8n", now + 0.15, 0.09);
}

/**
 * Disposes all Tone.js audio nodes.
 *
 * Call in development HMR cleanup to prevent orphaned nodes.
 * Safe to call repeatedly — no-ops if already disposed.
 *
 * @example
 * ```ts
 * if (process.env.NODE_ENV === "development") {
 *   disposeNavSounds()
 * }
 * ```
 */
export function disposeNavSounds(): void {
	synth?.dispose();
	synth = null;
	reverb?.dispose();
	reverb = null;
	vol?.dispose();
	vol = null;
	initialized = false;
}
