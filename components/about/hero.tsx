"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import profile from "@/public/me.jpg";

export default function Hero() {
	const [open, setOpen] = useState(false);
	const holdTimer = useRef<NodeJS.Timeout | null>(null);

	// Mobile: long press (300ms like Instagram)
	const handleTouchStart = () => {
		holdTimer.current = setTimeout(() => {
			setOpen(true);
		}, 300);
	};

	const handleTouchEnd = () => {
		if (holdTimer.current) {
			clearTimeout(holdTimer.current);
		}
	};

	// Desktop: click
	const handleClick = () => {
		setOpen(true);
	};

	return (
		<>
			<section className="flex items-center justify-between gap-6">
				{/* Text */}
				<h1 className="text-balance font-semibold text-xl md:text-3xl">
					Laxman K R
					<br />
					<span className="text-muted-foreground text-sm transition-colors duration-300 ease-in-out md:text-lg">
						AI Engineer
					</span>
				</h1>

				{/* Avatar */}
				<button
					className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-full md:h-24 md:w-24"
					onClick={handleClick}
					onTouchEnd={handleTouchEnd}
					onTouchStart={handleTouchStart}
				>
					<Image
						alt="Laxman K R"
						className="object-cover"
						fill
						priority
						src={profile}
					/>
				</button>
			</section>

			{/* Clean Instagram-style Dialog */}
			<Dialog onOpenChange={setOpen} open={open}>
				<DialogContent
					className={cn(
						"max-w-[70vw] rounded-full border-none p-0 sm:max-w-[50vw] md:max-w-[30vw]",
						"data-[state=closed]:animate-out data-[state=open]:animate-in",
						"data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
						"data-[state=open]:zoom-in-90 data-[state=closed]:zoom-out-90",
						"duration-300"
					)}
					showCloseButton={false}
				>
					<div className="relative aspect-square overflow-hidden rounded-full">
						<Image
							alt="Laxman K R"
							className="object-cover"
							fill
							src={profile}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
