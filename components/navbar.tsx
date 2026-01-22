"use client";

import cn from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Kbd } from "./ui/kbd";

function Item(props: React.ComponentProps<typeof Link>) {
    const pathname = usePathname();
    const href = props.href;

    if (typeof href !== "string") {
        throw new Error("`href` must be a string");
    }

    const isActive = pathname === href || pathname.startsWith(href + "/");

    return (
        <li
            className={cn(
                isActive
                    ? "text-rurikon-800"
                    : "text-rurikon-300 hover:text-rurikon-600",
                "transition-colors hover:transform-none",
                "-mx-2",
            )}
        >
            <Link
                {...props}
                className="inline-block lowercase w-full px-2 focus-visible:outline focus-visible:outline-rurikon-400
          focus-visible:rounded-xs focus-visible:outline-dotted focus-visible:text-rurikon-600"
                draggable={false}
            />
        </li>
    );
}

export default function Navbar() {
    return (
        <nav className="mobile:mr-6 sm:mr-10 md:mr-14 w-full mobile:w-16 md:w-auto">
            <ul className="text-right mobile:sticky top-6 sm:top-10 md:top-14 mb-6 mobile:mb-0 flex gap-2 justify-end mobile:block">
                <Item href="/">
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="lowercase cursor-pointer">About</span>
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            sideOffset={12}
                            className="flex items-center gap-2"
                        >
                            Press <Kbd>A</Kbd>
                        </TooltipContent>
                    </Tooltip>
                </Item>

                <Item href="/projects">
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="lowercase cursor-pointer">Projects</span>
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            sideOffset={12}
                            className="flex items-center gap-2"
                        >
                            Press <Kbd>P</Kbd>
                        </TooltipContent>
                    </Tooltip>
                </Item>

                <Item href="/timeline">
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="lowercase cursor-pointer">Timeline</span>
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            sideOffset={12}
                            className="flex items-center gap-2"
                        >
                            Press <Kbd>T</Kbd>
                        </TooltipContent>
                    </Tooltip>
                </Item>

                <Item href="/writings">
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="lowercase cursor-pointer">Writings</span>
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            sideOffset={12}
                            className="flex items-center gap-2"
                        >
                            Press <Kbd>W</Kbd>
                        </TooltipContent>
                    </Tooltip>
                </Item>
            </ul>
        </nav>
    );
}
