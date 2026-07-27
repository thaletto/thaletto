"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AnalyticsCollector() {
	const pathname = usePathname();

	useEffect(() => {
		if (pathname.startsWith("/admin")) {
			return;
		}
		let collected = false;
		const collectVisibleView = () => {
			if (collected || document.visibilityState !== "visible") {
				return;
			}
			collected = true;
			fetch("/api/analytics/view", {
				body: JSON.stringify({ pathname }),
				credentials: "same-origin",
				headers: { "content-type": "application/json" },
				keepalive: true,
				method: "POST",
			}).catch(() => undefined);
		};
		collectVisibleView();
		document.addEventListener("visibilitychange", collectVisibleView);
		return () =>
			document.removeEventListener("visibilitychange", collectVisibleView);
	}, [pathname]);

	return null;
}
