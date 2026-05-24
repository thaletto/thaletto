"use client";

import type React from "react";
import { cn } from "@/lib/utils";

/**
 * TimelineDot renders a circular dot indicator used in the timeline UI.
 * It is positioned on the vertical axis line to represent a specific event or point in time.
 *
 * @returns {React.JSX.Element} The circular dot indicator component.
 */
export function TimelineDot(): React.JSX.Element {
    return (
        <span
            className={cn(
                "relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-border bg-border transition-colors duration-300 group-hover/item:bg-muted-foreground",
            )}
        />
    );
}
