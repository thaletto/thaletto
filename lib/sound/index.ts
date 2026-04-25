"use client";

import * as Tone from "tone";

/**
 * Navigation Sound System
 *
 * Provides exit/enter audio feedback for page transitions using Tone.js.
 * Designed to complement React's ViewTransition API with a crossfade effect.
 *
 * @packageDocumentation
 */

/**
 * Reverb effect node for spatial navigation audio.
 * Initialized lazily on first sound playback.
 *
 * @internal
 */
let reverb: Tone.Reverb | null = null;

/**
 * Master volume node controlling overall output level.
 * Initialized lazily on first sound playback.
 *
 * @internal
 */
let vol: Tone.Volume | null = null;

/**
 * Polyphonic synthesizer for playing navigation tones.
 * Initialized lazily on first sound playback.
 *
 * @internal
 */
let synth: Tone.PolySynth | null = null;

/**
 * Tracks whether the audio context and synth nodes have been initialized.
 *
 * @internal
 */
let initialized = false;

/**
 * Initializes the Tone.js audio context and creates shared effect nodes.
 *
 * Must be called before any playback to ensure the AudioContext is started
 * (required by browser autoplay policies). Creates a reverb with 3.5s decay
 * and a polyphonic synth with sine oscillators.
 *
 * @internal
 *
 * @returns Promise resolving to true if initialization succeeded, false if server-side
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
 * Plays the navigation enter sound: an ascending tonal step paired with
 * a layered ripple chord bloom.
 *
 * The ascending step (D4 → G4) provides immediate directional feedback,
 * while the arpeggiated chord (C4 → E4 → G4) creates an ambient tail that
 * outlasts the crossfade transition. This combination produces a spacious,
 * spatial quality that complements view transitions.
 *
 * @example
 * ```ts
 * // Called when a page transition completes (after crossfade)
 * await playNavEnter()
 * ```
 *
 * @returns Promise that resolves when playback finishes
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
 * Plays the navigation exit sound: a descending tonal step paired with
 * a reversed ripple chord bloom.
 *
 * Mirror of playNavEnter in reverse — the descending step (G4 → D4) and
 * reversed chord (G4 → E4 → C4) signal the departure from the current view.
 * Played at slightly lower volume and with shorter release to avoid competing
 * with the enter sound that fires ~300ms later during a crossfade.
 *
 * @example
 * ```ts
 * // Called in NavLink onClick before navigation
 * playNavExit()
 * ```
 *
 * @returns Promise that resolves when playback finishes
 */
export async function playNavExit(): Promise<void> {
	if (!(await ensureReady())) return;

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
 * Disposes all audio nodes and effect chain.
 *
 * Cleans up the synth, reverb, and volume nodes to free memory.
 * Call this during development HMR cleanup or when unmounting the sound system.
 *
 * @example
 * ```ts
 * // In dev HMR cleanup
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
