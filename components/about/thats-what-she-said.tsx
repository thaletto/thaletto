"use client";
import Image from "next/image";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import thatswhatshesaid from "@/public/thats-what-she-said.gif";

export default function ThatsWhatSheSaid() {
	const isMobile = useIsMobile();

	const Trigger = (
		<span className="cursor-pointer font-serif underline">
			that's what she said
		</span>
	);

	const Content = (
		<Image
			alt="that's what she said"
			className="rounded-lg"
			priority
			src={thatswhatshesaid}
			unoptimized
		/>
	);

	if (isMobile) {
		return (
			<Popover>
				<PopoverTrigger>{Trigger}</PopoverTrigger>
				<PopoverContent
					className="max-w-50 rounded-lg p-0"
					side="right"
					sideOffset={8}
				>
					{Content}
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<HoverCard>
			<HoverCardTrigger>{Trigger}</HoverCardTrigger>
			<HoverCardContent className="rounded-lg p-0" side="right" sideOffset={8}>
				{Content}
			</HoverCardContent>
		</HoverCard>
	);
}
