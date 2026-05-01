import Image from "next/image";

interface SvgIconProps {
	className?: string;
	height?: number | string;
	name: string;
	src: string;
	width?: number;
}

export default function SvgIcon({
	name,
	src,
	width = 24,
	className,
}: SvgIconProps) {
	return (
		<Image
			alt={name}
			className={className}
			loading="lazy"
			src={src}
			width={width}
		/>
	);
}
