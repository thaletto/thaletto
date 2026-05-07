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
		<img
			alt={name}
			className={className}
			loading="lazy"
			src={src}
			width={width}
		/>
	);
}
