"use client";

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
            href={link}
            target="_blank"
            rel="noreferrer"
            draggable={false}
            className="group block rounded-lg overflow-clip select-none my-7 transition-colors hover:bg-white border border-rurikon-border"
        >
            <img
                src={image}
                className="m-0 w-full aspect-[1.9/1] object-cover"
            />
            {title && <p className="m-2 text-sm">{title}</p>}
            {desc && <p className="m-2 opacity-80 text-xs">{desc}</p>}
            {link && (
                <p className="m-2 text-rurikon-200 text-xs transition-colors group-hover:text-rurikon-300">
                    {link}
                </p>
            )}
        </a>
    );
}
