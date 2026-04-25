"use client";

import * as Tone from "tone";

/** Shared reverb node for all navigation sounds. Initialized lazily on first playback. */
let reverb: Tone.Reverb | null = null;

/** PolySynth for enter sound — plays ascending melodic arc with arpeggiated chord bloom. */
let synthEnter: Tone.PolySynth | null = null;
/** Volume control for enter synth. Set to -12dB to keep sounds ambient. */
let volEnter: Tone.Volume | null = null;

/** PolySynth for exit sound — plays descending step (G4 → D4) with reversed bloom. */
let synthExit: Tone.PolySynth | null = null;
/** Volume control for exit synth. Same level as enter synth. */
let volExit: Tone.Volume | null = null;

/** Tracks whether Tone.js nodes have been created. Prevents double initialization. */
let initialized = false;

/**
 * Ensures the Tone.js audio context is started and all synth nodes are created.
 * Lazy-initializes on first call. Safe to call on the server (returns false).
 *
 * @returns `true` if ready for playback, `false` if running server-side.
 */
async function ensureReady(): Promise<boolean> {
	if (typeof window === "undefined") return false;
	await Tone.start();

	if (!initialized) {
		reverb = new Tone.Reverb({ decay: 3.5, wet: 0.48 }).toDestination();

		volEnter = new Tone.Volume(-12).connect(reverb);
		synthEnter = new Tone.PolySynth(Tone.Synth, {
			oscillator: { type: "sine" },
			envelope: { attack: 0.012, decay: 0.35, sustain: 0.06, release: 2.2 },
		} as Tone.SynthOptions).connect(volEnter);

		volExit = new Tone.Volume(-12).connect(reverb);
		synthExit = new Tone.PolySynth(Tone.Synth, {
			oscillator: { type: "sine" },
			envelope: { attack: 0.008, decay: 0.12, sustain: 0, release: 0.3 },
		} as Tone.SynthOptions).connect(volExit);

		await reverb.generate();
		initialized = true;
	}

	return true;
}

/**
 * Plays the navigation enter sound — an ascending melodic step (D4 → G4) layered with
 * an arpeggiated chord bloom (C4 → E4 → G4). Designed to complement the crossfade transition;
 * the chord's 2.2s release creates an ambient tail that outlasts the visual transition.
 *
 * Initializing the audio context on the first call — subsequent calls play immediately.
 * No-ops if called server-side.
 *
 * @returns A promise that resolves when the sound has been triggered.
 */
export async function playNavEnter(): Promise<void> {
	if (!(await ensureReady())) return;
	const now = Tone.now();
	synthEnter!.triggerAttackRelease("D4", "16n", now, 1.0);
	synthEnter!.triggerAttackRelease("G4", "16n", now + 0.09, 1.0);
	synthEnter!.triggerAttackRelease("C4", "8n", now + 0.04, 1.0);
	synthEnter!.triggerAttackRelease("E4", "8n", now + 0.095, 1.0);
	synthEnter!.triggerAttackRelease("G4", "8n", now + 0.15, 1.0);
}

/**
 * Plays the navigation exit sound — a descending step (G4 → D4) with a reversed
 * chord bloom. Slightly quieter and shorter than the enter sound to avoid competing
 * with it (~300ms later).
 *
 * Fire-and-forget: does not need to be awaited. No-ops if called server-side.
 *
 * @returns A promise that resolves when the sound has been triggered.
 */
export async function playNavExit(): Promise<void> {
	if (!(await ensureReady())) return;
	const now = Tone.now();
	synthExit!.triggerAttackRelease("G4", "16n", now, 0.25);
	synthExit!.triggerAttackRelease("D4", "16n", now + 0.08, 0.25);
}

/**
 * Disposes all Tone.js nodes created by this module and resets the initialization state.
 * Call this in dev HMR cleanup if you need to reinitialize the audio context after hot reload.
 *
 * @example
 * if (process.env.NODE_ENV === "development") {
 *   disposeNavSounds();
 * }
 */
export function disposeNavSounds(): void {
	synthEnter?.dispose();
	synthEnter = null;
	synthExit?.dispose();
	synthExit = null;
	volEnter?.dispose();
	volEnter = null;
	volExit?.dispose();
	volExit = null;
	reverb?.dispose();
	reverb = null;
	initialized = false;
}
