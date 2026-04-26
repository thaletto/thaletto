"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { sounds } from "@/lib/sound";

/** @internal Delay before firing enter sound to sync with ViewTransition crossfade */
const ENTER_DELAY_MS = 200;

/**
 * Headless component that watches `pathname` and fires `playNavEnter()` on route changes.
 *
 * Skips the initial page load — only plays on actual navigations. The enter sound fires
 * after a 200ms gap from exit, creating a consistent sonic arc regardless of route
 * resolution speed.
 *
 * Place once in your root layout (below `<TooltipProvider>` is fine):
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
 *
 * @returns null (renders nothing — side-effect only)
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

		timerRef.current = setTimeout(() => {
			sounds.playEnter();
			timerRef.current = null;
		}, ENTER_DELAY_MS);

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [pathname]);

	return null;
}
