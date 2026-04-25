"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { playNavEnter } from "@/lib/sound/";

/** Delay before playing the enter sound, synced with ViewTransition crossfade duration.
 * @constant @internal
 */
const ENTER_DELAY_MS = 180;

/**
 * Triggers navigation enter sound on route changes.
 *
 * A headless component that watches the current pathname and fires
 * `playNavEnter()` whenever the route changes (excluding initial page load).
 * Uses a 180ms delay to sync with React's ViewTransition crossfade —
 * the enter sound plays after the visual transition begins, creating
 * a cohesive sonic arc across the page change.
 *
 * Place this component anywhere in your RootLayout — below `<TooltipProvider>`
 * is a good location.
 *
 * Note: Exit sounds require more coordination since Next.js App Router
 * doesn't expose a "before navigate" hook to layout components. Two approaches:
 *
 * **Option A (simple)**: Use only `NavSoundTrigger` — the enter sound alone
 * provides sufficient audio feedback without needing to wrap every Link.
 *
 * **Option B (full)**: Wrap your Link components in a custom component that
 * calls `playNavExit()` in onClick before `router.push()`. See `NavLink.tsx`
 * for an example implementation.
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * <TooltipProvider>
 *   <NavSoundTrigger />
 *   {children}
 * </TooltipProvider>
 * ```
 *
 * @returns null (renders nothing)
 */
export function NavSoundTrigger() {
	const pathname = usePathname();
	const isFirst = useRef(true);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (isFirst.current) {
			isFirst.current = false;
			return;
		}

		// Cancel any pending enter sound from a rapid navigation
		if (timerRef.current) clearTimeout(timerRef.current);

		timerRef.current = setTimeout(() => {
			playNavEnter();
			timerRef.current = null;
		}, ENTER_DELAY_MS);

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [pathname]);

	return null;
}
