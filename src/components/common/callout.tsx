import { LuInfo, LuLightbulb, LuTriangleAlert } from "react-icons/lu";
import { cn } from "@/lib/utils";

export function Callout({
	children,
	type = "note",
}: {
	children: React.ReactNode;
	type?: "note" | "tip" | "warning";
}) {
	const variants = {
		note: {
			styles: "bg-secondary text-secondary-foreground",
			icon: <LuInfo className="h-4 w-4" />,
		},
		tip: {
			styles: "bg-secondary text-secondary-foreground",
			icon: <LuLightbulb className="h-4 w-4" />,
		},
		warning: {
			styles: "bg-destructive text-destructive-foreground",
			icon: <LuTriangleAlert className="h-4 w-4" />,
		},
	};

	const { styles, icon } = variants[type];

	return (
		<div
			className={cn(
				"mt-4 flex gap-3 rounded-lg px-4 py-3 text-foreground",
				styles
			)}
		>
			{/* Icon container aligned to first line of text */}
			<div className="mt-1 flex shrink-0 items-start">{icon}</div>

			{/* Text wrapper: remove margins from markdown paragraphs */}
			<div className="flex-1 [&>p:not(:last-child)]:mb-2 [&>p]:m-0">
				{children}
			</div>
		</div>
	);
}
