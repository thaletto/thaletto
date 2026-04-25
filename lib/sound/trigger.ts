/**
 * Navigation Sound Trigger
 *
 * Headless component that watches the pathname and fires the enter sound
 * on route changes. Skips the initial page load — only fires for actual
 * navigations. Uses a timing gap relative to when the exit sound fired
 * to ensure consistent timing regardless of how fast the route resolved.
 *
 * @module
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { playNavEnter } from "@/lib/sound";
import { lastExitAt } from "@/lib/sound/timing";

/**
 * Desired gap between exit sound firing and enter sound firing, in ms.
 * 500ms gives a clear breath between the two sounds.
 */
const DESIRED_GAP_MS = 500;

/**
 * Headless component that triggers the enter sound on route changes.
 *
 * Place once in your root layout (below `<TooltipProvider>` is fine).
 * Watches `pathname` and fires `playNavEnter()` after a computed delay
 * that ensures consistent timing from exit → enter regardless of how
 * fast the pathname resolved.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { NavSoundTrigger } from "@/lib/sound/trigger"
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <TooltipProvider>
 *           <NavSoundTrigger />
 *           {children}
 *         </TooltipProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
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

		if (timerRef.current) clearTimeout(timerRef.current);

		// How long ago did the exit sound fire?
		// Compute remaining wait so the total gap from exit → enter = DESIRED_GAP_MS,
		// regardless of how fast the pathname resolved.
		const elapsed = Date.now() - lastExitAt;
		const remaining = Math.max(0, DESIRED_GAP_MS - elapsed);

		timerRef.current = setTimeout(() => {
			playNavEnter();
			timerRef.current = null;
		}, remaining);

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [pathname]);

	return null;
}
