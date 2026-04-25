/**
 * Navigation timing coordination.
 *
 * Shared timestamp written by the exit sound, read by NavSoundTrigger.
 * This lets NavSoundTrigger delay relative to when the user actually navigated,
 * not when the new pathname resolved.
 *
 * @module
 */

export let lastExitAt = 0;

/**
 * Marks the moment the exit sound fired.
 *
 * Called by playNavExit() — stores the current timestamp so the enter
 * trigger can compute elapsed time and achieve consistent gap timing.
 */
export function markExit() {
	lastExitAt = Date.now();
}
