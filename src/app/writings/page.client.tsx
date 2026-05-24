"use client";

import { motion } from "motion/react";
import { NavLink } from "@/components/nav-link";
import { AnimatedBackground } from "@/components/animated-background";
import type { WritingItem } from "./page";

const VARIANTS_SECTION = {
	hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
	visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const TRANSITION_SECTION = {
	duration: 0.3,
};

export function WritingsList({ items }: { items: WritingItem[] }) {
	return (
		<motion.section
			initial="hidden"
			animate="visible"
			variants={VARIANTS_SECTION}
			transition={TRANSITION_SECTION}
		>
			<AnimatedBackground
				enableHover
				className="h-full w-full rounded-lg bg-accent/80"
				transition={{
					type: "spring",
					bounce: 0,
					duration: 0.2,
				}}
			>
				{items.map((item) => (
					<NavLink
						key={item.slug}
						data-id={item.slug}
						className="-mx-3 flex w-full flex-col gap-2 rounded-xl px-3 py-3"
						href={`/writings/${item.slug}`}
					>
						{/* Row 1: title + date */}
						<div className="flex w-full flex-row gap-4">
							<span className="flex-1 min-w-0 font-semibold text-base md:text-xl">
								{item.title}
							</span>
							<time className="shrink-0 font-normal text-muted-foreground tabular-nums">
								{item.date}
							</time>
						</div>

						{/* Row 2: description, completely separate */}
						{item.description && (
							<p className="font-normal text-muted-foreground">
								{item.description}
							</p>
						)}
					</NavLink>
				))}
			</AnimatedBackground>
		</motion.section>
	);
}
