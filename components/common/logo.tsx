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
            src={src}
            alt={name}
            width={width}
            
            className={className}
            loading="lazy"
        />
    );
}
