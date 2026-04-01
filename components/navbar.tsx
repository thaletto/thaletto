"use client";

import cn from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Kbd } from "./ui/kbd";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { LuMenu } from "react-icons/lu";
import { useState } from "react";

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
                        ? "text-rurikon-800"
                        : "text-rurikon-300 hover:text-rurikon-600",
                    "transition-colors hover:transform-none",
                    "-mx-2",
                ),
                props.className)
            }
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

function DesktopNav() {
    return (
        <nav className="mr-14 w-auto hidden md:block">
            <ul className="flex flex-col gap-2 text-right sticky top-14">
                {NAV_ITEMS.map((item) => (
                    <Item key={item.href} href={item.href}>
                        <Tooltip>
                            <TooltipTrigger>
                                <span className="lowercase cursor-pointer">
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
function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <LuMenu size={16}/>
                </SheetTrigger>

                <SheetContent
                    side="top"
                    showCloseButton={false}
                    className="bg-[#fcfcfc] h-1/3 flex flex-col"
                >
                    <nav className="flex-1 px-6 my-6">
                        <ul className="flex flex-col h-full justify-around">
                            {NAV_ITEMS.map((item) => (
                                <Item
                                    key={item.href}
                                    href={item.href}
                                    className="text-xl md:text-3xl h-full flex items-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="lowercase w-full">
                                        {item.label}
                                    </span>
                                </Item>
                            ))}
                        </ul>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default function Navbar() {
    return (
        <>
            <MobileNav />
            <DesktopNav />
        </>
    );
}
