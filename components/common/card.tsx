"use client";
import Image from "next/image";

export function Card({
	image,
	title,
	desc,
	link,
}: {
	image: string;
	title?: string;
	desc?: string;
	link?: string;
}) {
	return (
		<a
			className="group block select-none overflow-clip rounded-lg border border-border transition-colors hover:bg-secondary"
			draggable={false}
			href={link}
			rel="noreferrer"
			target="_blank"
		>
			<Image
				alt="card image" // or derive from title/desc
				className="m-0 aspect-[1.9/1] w-full object-cover"
				height={315}
				src={image}
				width={600}
			/>
			{title && <p className="m-2 text-sm">{title}</p>}
			{desc && <p className="m-2 text-xs opacity-80">{desc}</p>}
			{link && <p className="m-2 text-muted-foreground text-xs">{link}</p>}
		</a>
	);
}
