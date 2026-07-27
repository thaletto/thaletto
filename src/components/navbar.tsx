"use client";

import { BriefcaseBusiness, Clock3, PenLine } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import profile from "../../public/me.jpg";
import { NavLink } from "./nav-link";
import { SoundToggle } from "./sound-toggle";

const ITEMS = [
	{
		href: "/projects",
		icon: BriefcaseBusiness,
		key: "P",
		label: "Projects",
	},
	{ href: "/timeline", icon: Clock3, key: "T", label: "Timeline" },
	{ href: "/writings", icon: PenLine, key: "W", label: "Writings" },
] as const;

export default function Navbar() {
	const pathname = usePathname();

	return (
		<nav aria-label="Main navigation" className="portfolio-dock">
			<span aria-hidden className="dock-glass" />
			<NavLink
				aria-current={pathname === "/" ? "page" : undefined}
				aria-label="About, shortcut A"
				className="dock-item"
				data-active={pathname === "/" || undefined}
				href="/"
			>
				<Image
					alt=""
					className="size-7 rounded-full object-cover"
					height={28}
					src={profile}
					width={28}
				/>
				<span className="dock-tooltip">
					About <kbd>A</kbd>
				</span>
			</NavLink>
			<span aria-hidden className="dock-rule" />
			{ITEMS.map(({ href, icon: Icon, key, label }) => {
				const active = pathname.startsWith(href);
				return (
					<NavLink
						aria-current={active ? "page" : undefined}
						aria-label={`${label}, shortcut ${key}`}
						className="dock-item"
						data-active={active || undefined}
						href={href}
						key={href}
					>
						<Icon aria-hidden className="size-4" />
						<span className="dock-tooltip">
							{label} <kbd>{key}</kbd>
						</span>
					</NavLink>
				);
			})}
			<span aria-hidden className="dock-rule" />
			<SoundToggle />
		</nav>
	);
}
