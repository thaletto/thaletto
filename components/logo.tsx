type SvgIconProps = {
    name: string;
    width?: number | string;
    height?: number | string;
    className?: string;
};

export default function SvgIcon({
    name,
    width = 24,
    height = 24,
    className,
}: SvgIconProps) {
    return (
        <img
            src={`/${name}.svg`}
            alt={name}
            width={width}
            height={height}
            className={className}
            loading="lazy"
        />
    );
}
