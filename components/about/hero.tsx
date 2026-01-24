"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import profile from "@/public/me.jpg";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Hero() {
    const [open, setOpen] = useState(false);
    const holdTimer = useRef<NodeJS.Timeout | null>(null);

    // Mobile: long press (300ms like Instagram)
    const handleTouchStart = () => {
        holdTimer.current = setTimeout(() => {
            setOpen(true);
        }, 300);
    };

    const handleTouchEnd = () => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
        }
    };

    // Desktop: click
    const handleClick = () => {
        setOpen(true);
    };

    return (
        <>
            <section className="flex items-center justify-between gap-6">
                {/* Text */}
                <h1 className="font-semibold text-xl md:text-3xl text-rurikon-600 text-balance">
                    Laxman K R
                    <br />
                    <span className="text-sm md:text-lg text-rurikon-400 transition-colors duration-300 ease-in-out">
                        AI Engineer
                    </span>
                </h1>

                {/* Avatar */}
                <button
                    className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden cursor-pointer"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={handleClick}
                >
                    <Image
                        src={profile}
                        alt="Laxman K R"
                        fill
                        className="object-cover"
                        priority
                    />
                </button>
            </section>

            {/* Clean Instagram-style Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className={'border-none max-w-[70vw] sm:max-w-[50vw] md:max-w-[30vw] p-0 rounded-full'} showCloseButton={false}>
                    <div className="relative aspect-square rounded-full overflow-hidden">
                        <Image
                            src={profile}
                            alt="Laxman K R"
                            fill
                            className="object-cover"
                        />
                    </div>
                </DialogContent>      
            </Dialog>
        </>
    );
}
