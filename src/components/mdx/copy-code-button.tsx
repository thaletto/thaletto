"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { sounds } from "@/lib/sound";

export function CopyCodeButton({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);

	async function copy() {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		sounds.playCue("confirm").catch(() => undefined);
		window.setTimeout(() => setCopied(false), 1500);
	}

	const Icon = copied ? Check : Copy;
	return (
		<button
			aria-label={copied ? "Code copied" : "Copy code"}
			className="mdx-copy-button"
			onClick={copy}
			type="button"
		>
			<Icon aria-hidden />
		</button>
	);
}
