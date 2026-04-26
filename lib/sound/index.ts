import * as Tone from "tone";

const PENTATONIC_SCALE = ["C", "D", "E", "G", "A"] as const;
const BASE_OCTAVE = 3;

const CHORD_WINDOW_MS = 100;

/**
 * Crossfade navigation sound system using Tone.js.
 *
 * Provides exit/enter audio feedback that complements React's ViewTransition API.
 * Manages a pair of polyphonic synths (enter and exit) with shared FX chain
 * (distortion + reverb → volume → destination).
 *
 * Typically used via the `sounds` singleton — prefer `NavLink` and `NavSoundTrigger`
 * over calling these methods directly.
 */
class SoundSystem {
	// Poly synths for entering and exiting
	private synthEnter: Tone.PolySynth | null = null;
	private synthExit: Tone.PolySynth | null = null;

	// Fx / routing
	private distortion: Tone.Distortion | null = null;
	private reverb: Tone.Reverb | null = null;
	private volume: Tone.Volume | null = null;

	// Lifecycle management
	private initialized = false;
	private initializing: Promise<void> | null = null;
	private muted = false;
	private currentNoteIndex = 0;
	private transport: ReturnType<typeof Tone.getTransport> | null = null;

	// Chord Scheduling
	private chordWindowStart: number | null = null;
	private chordStep = 0;
	private chordBaseIndex = 0;
	private chordBaseOctave = 0;

	// Error management
	private isPlayingFailure = false;
	private isPlayingInterrupt = false;

	// Small helpers
	private inChordWindow(now = Date.now()) {
		return (
			this.chordWindowStart !== null &&
			now - this.chordWindowStart <= CHORD_WINDOW_MS
		);
	}

	private async ready() {
		if (this.muted) {
			return false;
		}
		await this.initialize();
		return true;
	}

	private scheduleOnce(cb: () => void, time: string | number) {
		const t = this.transport ?? Tone.getTransport();
		t.scheduleOnce(cb, time);
	}

	// Initialization

	private async initialize() {
		if (this.initialized) {
			return;
		}
		if (this.initializing) {
			return this.initializing;
		}

		this.initializing = (async () => {
			await Tone.start();

			this.volume = new Tone.Volume(-12).toDestination();
			this.reverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).connect(
				this.volume
			);
			this.distortion = new Tone.Distortion({
				distortion: 0.8,
				wet: 1.0,
			}).connect(this.volume);

			this.synthEnter = new Tone.PolySynth(Tone.Synth, {
				oscillator: { type: "triangle" },
				envelope: { attack: 0.02, decay: 0.3, sustain: 0.1, release: 1.2 },
			} as Tone.SynthOptions).connect(this.reverb);

			this.synthExit = new Tone.PolySynth(Tone.Synth, {
				oscillator: { type: "sine" },
				envelope: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.1 },
			} as Tone.SynthOptions).connect(this.reverb);

			this.transport = Tone.getTransport();
			if (this.transport.state !== "started") {
				this.transport.start();
			}
			this.initialized = true;
		})();
	}

	// Note Selection

	private getNextNote(octaveOffset = 0) {
		const now = Date.now();
		const inChordWindow = this.inChordWindow(now);

		if (!inChordWindow) {
			// Start new chord window
			this.chordWindowStart = now;
			this.chordStep = 0;
			// Root of the chord based on rotating index
			this.chordBaseIndex = this.currentNoteIndex % PENTATONIC_SCALE.length;
			this.chordBaseOctave = BASE_OCTAVE + octaveOffset;
		}

		// Adjacent scale degrees within the same octave for tight harmony
		const scaleIndex =
			(this.chordBaseIndex + this.chordStep) % PENTATONIC_SCALE.length;
		const note = PENTATONIC_SCALE[scaleIndex];
		const octave = this.chordBaseOctave;

		// Advance counters for next call
		this.chordStep++;
		this.currentNoteIndex =
			(this.currentNoteIndex + 1) % (PENTATONIC_SCALE.length * 2);

		return `${note}${octave}`;
	}

	// Public API

	/**
	 * Plays an ascending tonal step layered with an arpeggiated chord bloom.
	 *
	 * Cycles through a pentatonic scale with a timing window to keep overlaps consonant.
	 * The chord's long release (1.2s) creates an ambient tail that outlasts visual
	 * transition. Called automatically by `NavSoundTrigger` on route changes.
	 *
	 * @returns Promise that resolves when sound is scheduled (or no-ops if muted)
	 */
	async playEnter() {
		if (!(await this.ready())) {
			return;
		}

		// Triad cycling within a timing window to keep overlaps consonant
		const now = Date.now();
		const inWindow = this.inChordWindow(now);

		if (!inWindow) {
			this.chordWindowStart = now;
			this.chordStep = 0;
			this.chordBaseIndex = this.currentNoteIndex % PENTATONIC_SCALE.length;
			this.chordBaseOctave = BASE_OCTAVE + 1; // brightness
		}

		const rootNoteName = PENTATONIC_SCALE[this.chordBaseIndex];
		const rootNoteStr = `${rootNoteName}${this.chordBaseOctave}`;

		const TRIAD_SEMITONES = [0, 4, 7] as const;
		const triadIndex = this.chordStep % TRIAD_SEMITONES.length;
		const semitoneOffset = TRIAD_SEMITONES[triadIndex] ?? 0;

		const note = Tone.Frequency(rootNoteStr).transpose(semitoneOffset).toNote();

		this.chordStep++;
		this.currentNoteIndex =
			(this.currentNoteIndex + 1) % (PENTATONIC_SCALE.length * 2);

		this.synthEnter?.triggerAttackRelease(note, "4n");
	}

	/**
	 * Plays a descending tonal step with a reversed chord bloom.
	 *
	 * Slightly quieter and shorter than the enter sound to avoid competing
	 * with it (~300ms later). Half an octave higher than base to create downward
	 * movement perception.
	 *
	 * @returns Promise that resolves when sound is scheduled (or no-ops if muted)
	 */
	async playExit() {
		if (!(await this.ready())) {
			return;
		}
		const note = this.getNextNote(0.5); // half octave higher
		this.synthExit?.triggerAttackRelease(note, "32n", undefined, 0.25);
	}

	/**
	 * Enables or disables audio playback entirely.
	 *
	 * When muted, all `playEnter()` and `playExit()` calls no-op immediately without
	 * initializing Tone.js. Persists across route changes.
	 *
	 * @param muted - Whether to prevent sound playback
	 */
	setMuted(muted: boolean) {
		this.muted = muted;
	}

	/**
	 * Sets the master volume.
	 *
	 * Maps linear input (0..1) to decibels. At 0, outputs -Infinity (silent).
	 * Default is -12dB for comfortable background levels.
	 *
	 * @param volume - Linear volume in range [0, 1]
	 */
	setVolume(volume: number) {
		if (!this.volume) {
			return;
		}
		// Map 0..1 to -Infinity..0 dB (0 => hard mute)
		const db = volume === 0 ? Number.NEGATIVE_INFINITY : -40 + volume * 40;
		this.volume.volume.value = db;
	}

	/**
	 * Disposes all Tone.js nodes and resets state.
	 *
	 * Call this during dev HMR cleanup to prevent orphaning audio nodes.
	 * Sets `initialized` to false so subsequent calls re-initialize properly.
	 */
	async dispose() {
		this.synthEnter?.dispose();
		this.synthEnter = null;
		this.synthExit?.dispose();
		this.synthExit = null;

		this.distortion?.dispose();
		this.distortion = null;
		this.reverb?.dispose();
		this.reverb = null;
		this.volume?.dispose();
		this.volume = null;

		this.initialized = false;
	}
}

/**
 * Singleton instance of the crossfade navigation sound system.
 *
 * Use `sounds.playEnter()` and `sounds.playExit()` directly if you need manual
 * control. Prefer `NavLink` and `NavSoundTrigger` for automatically wired
 * navigation sounds.
 *
 * @example
 * ```ts
 * import { sounds } from "@/lib/sound"
 *
 * // Fire enter sound via useEffect hook
 * await sounds.playEnter()
 *
 * // Fire exit sound on custom navigation
 * sounds.playExit()
 * ```
 */
export const sounds = new SoundSystem();
