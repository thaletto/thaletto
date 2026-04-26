type SvgIconProps = {
	name: string;
	src: string;
	width?: number | string;
	height?: number | string;
	className?: string;
};

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
