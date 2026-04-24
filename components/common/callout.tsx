import { cn } from "@/lib/utils";
import { LuInfo, LuTriangleAlert, LuLightbulb } from "react-icons/lu";

export function Callout({
    children,
    type = "note",
}: {
    children: React.ReactNode;
    type?: "note" | "tip" | "warning";
}) {
    const variants = {
        note: {
            styles: "bg-secondary text-secondary-foreground",
            icon: <LuInfo className="w-4 h-4" />,
        },
        tip: {
            styles: "bg-secondary text-secondary-foreground",
            icon: <LuLightbulb className="w-4 h-4" />,
        },
        warning: {
            styles: "bg-destructive text-destructive-foreground",
            icon: <LuTriangleAlert className="w-4 h-4" />,
        },
    };

    const { styles, icon } = variants[type];

    return (
        <div className={cn("mt-4 flex gap-3 rounded-lg px-4 py-3 text-foreground", styles)}>
            {/* Icon container aligned to first line of text */}
            <div className="shrink-0 mt-1 flex items-start">{icon}</div>

            {/* Text wrapper: remove margins from markdown paragraphs */}
            <div className="flex-1 [&>p]:m-0 [&>p:not(:last-child)]:mb-2">
                {children}
            </div>
        </div>
    );
}
