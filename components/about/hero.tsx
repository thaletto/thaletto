"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import profile from "@/public/me.jpg";
import { cn } from "@/lib/utils";

const HOLD_DELAY = 300;
// Strong ease-out per Emil's skill
const EASING = "cubic-bezier(0.23, 1, 0.32, 1)";

export default function Hero() {
    const [open, setOpen] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0, size: 0 });
    const holdTimer = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const captureOrigin = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setOrigin({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            size: rect.width,
        });
    };

    const startHold = useCallback(() => {
        captureOrigin();
        holdTimer.current = setTimeout(() => setOpen(true), HOLD_DELAY);
    }, []);

    const cancelHold = useCallback(() => {
        if (holdTimer.current) clearTimeout(holdTimer.current);
    }, []);

    // Close on backdrop click
    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (e.target === overlayRef.current) setOpen(false);
    }, []);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open]);

    // Derived CSS custom properties for the expand origin
    const expandStyle = {
        "--ox": `${origin.x}px`,
        "--oy": `${origin.y}px`,
        "--os": `${origin.size}px`,
    } as React.CSSProperties;

    return (
        <>
            <section className="flex items-center justify-between gap-6">
                <h1 className="font-semibold text-xl md:text-3xl text-rurikon-600 text-balance">
                    Laxman K R
                    <br />
                    <span className="text-sm md:text-lg text-rurikon-400 transition-colors duration-300 ease-in-out">
                        AI Engineer
                    </span>
                </h1>

                <button
                    ref={buttonRef}
                    className={cn(
                        "relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden",
                        // Press feedback — scale down on active, gated to pointer devices
                        "transition-transform duration-100",
                        "@media (hover: hover) { active:scale-95 }",
                    )}
                    onMouseDown={startHold}
                    onMouseUp={cancelHold}
                    onMouseLeave={cancelHold}
                    onTouchStart={startHold}
                    onTouchEnd={cancelHold}
                    onTouchCancel={cancelHold}
                    // Prevent default click; interaction is hold-only
                    onClick={(e) => e.preventDefault()}
                    aria-label="View profile photo"
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

            {/* Portal-style overlay — rendered outside section flow */}
            {open && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={expandStyle}
                    onClick={handleOverlayClick}
                >
                    {/* Backdrop: fades in independently */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        style={{
                            animation: `hero-backdrop-in 250ms ${EASING} forwards`,
                        }}
                    />

                    {/* Image container: expands from avatar position to final size */}
                    <div
                        className="relative rounded-full overflow-hidden z-10"
                        style={{
                            width: "min(70vw, 70vh)",
                            height: "min(70vw, 70vh)",
                            animation: `hero-expand-in 350ms ${EASING} forwards`,
                        }}
                    >
                        <Image
                            src={profile}
                            alt="Laxman K R"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes hero-backdrop-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /*
                 * Expand from avatar center:
                 *   translate moves the element so its center sits at the avatar center,
                 *   scale shrinks it to the avatar's size ratio,
                 *   then both animate to identity (centered, full size).
                 *
                 *   --ox/--oy: avatar center in viewport coords
                 *   --os: avatar diameter
                 *   The final element is min(70vw,70vh) wide — scale factor = --os / that.
                 *   We approximate with CSS calc; close enough for the visual.
                 */
                @keyframes hero-expand-in {
                    from {
                        transform:
                            translate(
                                calc(var(--ox) - 50vw),
                                calc(var(--oy) - 50vh)
                            )
                            scale(calc(var(--os) / min(70vw, 70vh)));
                        opacity: 0.6;
                    }
                    to {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                }

                /* Reduced motion: skip movement, keep fade */
                @media (prefers-reduced-motion: reduce) {
                    @keyframes hero-expand-in {
                        from { opacity: 0; }
                        to   { opacity: 1; }
                    }
                }

                /* Active press feedback gated to real pointer devices */
                @media (hover: hover) and (pointer: fine) {
                    button[aria-label="View profile photo"]:active {
                        transform: scale(0.95);
                    }
                }
            `}</style>
        </>
    );
}