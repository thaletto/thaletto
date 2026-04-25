"use client";

import Link, { type LinkProps } from "next/link";
import { playNavExit } from "@/lib/sound";

/**
 * Wraps Next.js Link to provide navigation exit sound feedback.
 *
 * A thin wrapper around Next.js `Link` that fires `playNavExit()` in the
 * onClick handler before navigation proceeds. Use this in your navigation
 * component instead of a plain `<Link>` to enable the full sound arc:
 * exit sound → crossfade → enter sound (~500ms gap).
 *
 * @example
 * ```tsx
 * // In your Navbar component
 * import { NavLink } from "@/components/nav-link"
 *
 * <NavLink href="/projects">Projects</NavLink>
 * <NavLink href="/about">About</NavLink>
 * ```
 *
 * @param props - Standard LinkProps plus children and optional className
 * @returns Link component with exit sound pre-loaded
 */
export function NavLink({
	children,
	onClick,
	...props
}: LinkProps & React.PropsWithChildren<{ className?: string }>) {
	/**
	 * @param children - React nodes to render as link content
	 * @param onClick - Optional click handler, called after exit sound fires
	 */
	return (
		<Link
			{...props}
			onClick={(e) => {
				playNavExit();
				onClick?.(e);
			}}
		>
			{children}
		</Link>
	);
}
