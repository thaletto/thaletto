"use client";
import cn from "clsx";
import type Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";
import { Kbd } from "./ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const NAV_ITEMS = [
	{ href: "/", label: "About", key: "A" },
	{ href: "/projects", label: "Projects", key: "P" },
	{ href: "/timeline", label: "Timeline", key: "T" },
	{ href: "/writings", label: "Writings", key: "W" },
];

function Item(props: React.ComponentProps<typeof Link>) {
	const pathname = usePathname();
	const href = props.href;

	if (typeof href !== "string") {
		throw new Error("`href` must be a string");
	}

	const isActive =
		href === "/"
			? pathname === "/"
			: pathname === href || pathname.startsWith(`${href}/`);
	return (
		<li
			className={cn(
				isActive
					? "text-foreground"
					: "text-muted-foreground hover:text-foreground",
				"transition-colors hover:transform-none",
				"-mx-2",
				props.className
			)}
		>
			<NavLink
				{...props}
				className="inline-block w-full px-2 lowercase focus-visible:rounded-xs focus-visible:outline focus-visible:outline-dotted focus-visible:outline-ring"
			/>
		</li>
	);
}

export default function Navbar() {
	return (
		<nav className="mobile:mr-6 mobile:w-16 w-full sm:mr-10 md:mr-14">
			<ul className="mobile:sticky top-6 mb-6 mobile:mb-0 mobile:block flex justify-end gap-2 text-left sm:top-10 md:top-14">
				{NAV_ITEMS.map((item) => (
					<Item href={item.href} key={item.href}>
						<Tooltip>
							<TooltipTrigger>
								<span className="cursor-pointer">{item.label}</span>
							</TooltipTrigger>
							<TooltipContent
								className="hidden items-center gap-2 md:flex"
								side="right"
								sideOffset={12}
							>
								Press <Kbd>{item.key}</Kbd>
							</TooltipContent>
						</Tooltip>
					</Item>
				))}
			</ul>
		</nav>
	);
}
