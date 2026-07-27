"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { savedSoundEnabled, setSoundEnabled, sounds } from "@/lib/sound";

export function SoundToggle() {
	const [enabled, setEnabled] = useState(true);

	useEffect(() => {
		const saved = savedSoundEnabled();
		setEnabled(saved);
		sounds.setMuted(!saved);
	}, []);

	function toggle() {
		const next = !enabled;
		if (!next) {
			sounds.playCue("close").catch(() => undefined);
		}
		setEnabled(next);
		setSoundEnabled(next);
		if (next) {
			sounds.playCue("confirm").catch(() => undefined);
		}
	}

	const Icon = enabled ? Volume2 : VolumeX;

	return (
		<button
			aria-label={enabled ? "Mute sounds" : "Enable sounds"}
			aria-pressed={enabled}
			className="dock-item"
			onClick={toggle}
			type="button"
		>
			<Icon aria-hidden className="size-4" />
			<span className="dock-tooltip">
				{enabled ? "Mute sounds" : "Enable sounds"}
			</span>
		</button>
	);
}
