"use client";
import mermaid from "mermaid";
import { useEffect, useRef } from "react";

export function Mermaid({ children }: { children: string }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		mermaid.initialize({
			startOnLoad: false,
			theme: "neutral",
		});
		mermaid.render(`mermaid-${Date.now()}`, children).then(({ svg }) => {
			if (ref.current) {
				ref.current.innerHTML = svg;
			}
		});
	}, [children]);

	return <div className="mt-4" ref={ref} />;
}
