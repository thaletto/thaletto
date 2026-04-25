"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { playNavEnter } from "@/lib/sound/";

/**
 * Triggers navigation enter sound on route changes.
 *
 * A headless component that watches the current pathname and fires
 * `playNavEnter()` whenever the route changes (excluding initial page load).
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

	useEffect(() => {
		// Skip the very first render (page load) — no transition has happened.
		if (isFirst.current) {
			isFirst.current = false;
			return;
		}
		playNavEnter();
	}, [pathname]);

	return null;
}
