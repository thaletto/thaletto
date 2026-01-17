import { cn } from "@/lib/utils";
import { LuInfo, LuTriangleAlert, LuLightbulb } from "react-icons/lu";

export function Callout({
    children,
    type = "note",
}: {
    children: React.ReactNode;
    type?: "note" | "tip" | "warning";
}) {
    const styles = {
        note: {
            bg: "bg-[#e5f2fc]",
            icon: <LuInfo className="w-4 h-4" />,
        },
        tip: {
            bg: "bg-[#e8f1ec]",
            icon: <LuLightbulb className="w-4 h-4" />,
        },
        warning: {
            bg: "bg-[#f9f3dc]",
            icon: <LuTriangleAlert className="w-4 h-4" />,
        },
    };

    const { bg, icon } = styles[type];

    return (
        <div className={cn("mt-4 flex gap-3 rounded-lg px-4 py-3 text-rurikon-500", bg)}>
            {/* Icon container aligned to first line of text */}
            <div className="shrink-0 mt-1 flex items-start">{icon}</div>

            {/* Text wrapper: remove margins from markdown paragraphs */}
            <div className="flex-1 [&>p]:m-0 [&>p:not(:last-child)]:mb-2">
                {children}
            </div>
        </div>
    );
}
