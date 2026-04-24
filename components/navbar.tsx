"use client";
import cn from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Kbd } from "./ui/kbd";

const NAV_ITEMS = [
    { href: "/", label: "About", key: "A" },
    { href: "/projects", label: "Projects", key: "P" },
    { href: "/timeline", label: "Timeline", key: "T" },
    { href: "/writings", label: "Writings", key: "W" },
];

function Item(props: React.ComponentProps<typeof Link>) {
    const pathname = usePathname();
    const href = props.href;

    if (typeof href !== "string") {
        throw new Error("`href` must be a string");
    }

    const isActive = pathname === href || pathname.startsWith(href + "/");

    return (
        <li
            className={
                (cn(
                    isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    "transition-colors hover:transform-none",
                    "-mx-2",
                ),
                props.className)
            }
        >
            <Link
                {...props}
                className="inline-block lowercase w-full px-2 focus-visible:outline focus-visible:outline-ring
                    focus-visible:rounded-xs focus-visible:outline-dotted"
                draggable={false}
            />
        </li>
    );
}

export default function Navbar() {
    return (
        <nav className="mobile:mr-6 sm:mr-10 md:mr-14 w-full mobile:w-16">
            <ul className="text-left mobile:sticky top-6 sm:top-10 md:top-14 mb-6 mobile:mb-0 flex gap-2 justify-end mobile:block">
                {NAV_ITEMS.map((item) => (
                    <Item key={item.href} href={item.href}>
                        <Tooltip>
                            <TooltipTrigger>
                                <span className="cursor-pointer">
                                    {item.label}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                sideOffset={12}
                                className="hidden md:flex items-center gap-2"
                            >
                                Press <Kbd>{item.key}</Kbd>
                            </TooltipContent>
                        </Tooltip>
                    </Item>
                ))}
            </ul>
        </nav>
    );
}
