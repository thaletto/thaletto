"use client";

import { ListTree } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContentHeading } from "@/lib/content";
import { sounds } from "@/lib/sound";

export function ContentRail({ headings }: { headings: ContentHeading[] }) {
	const [active, setActive] = useState(headings[0]?.id ?? "");
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((entry) => entry.isIntersecting);
				if (visible?.target.id) {
					setActive(visible.target.id);
				}
			},
			{ rootMargin: "-20% 0px -70%" }
		);
		for (const heading of headings) {
			const element = document.getElementById(heading.id);
			if (element) {
				observer.observe(element);
			}
		}
		return () => observer.disconnect();
	}, [headings]);

	if (headings.length < 2) {
		return null;
	}

	return (
		<>
			<button
				aria-expanded={open}
				className="content-rail-toggle"
				onClick={() => {
					const next = !open;
					setOpen(next);
					sounds.playCue(next ? "open" : "close").catch(() => undefined);
				}}
				type="button"
			>
				<ListTree aria-hidden />
				On this page
			</button>
			<nav
				aria-label="On this page"
				className="content-rail"
				data-open={open || undefined}
			>
				<ol>
					{headings.map((heading) => (
						<li data-depth={heading.depth} key={heading.id}>
							<a
								aria-current={active === heading.id ? "location" : undefined}
								href={`#${heading.id}`}
								onClick={() => setOpen(false)}
							>
								{heading.label}
							</a>
						</li>
					))}
				</ol>
			</nav>
		</>
	);
}
