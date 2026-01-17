import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { readFile } from "fs/promises";
import path from "path";

export default async function Skills({ className }: { className?: string }) {
    const filePath = path.join(process.cwd(), "/lib/skills.txt");
    const data = await readFile(filePath, "utf-8");

    const skills = data
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {skills.map((tag) => (
                <Badge
                    key={tag}
                    variant="outline"
                    className="px-2 py-0.5 rounded-sm"
                >
                    {tag}
                </Badge>
            ))}
        </div>
    );
}
