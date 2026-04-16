import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
    const dir = path.join(process.cwd(), "app", "writings", "_writings");

    try {
        const files = await fs.readdir(dir);

        const items = await Promise.all(
            files
                .filter((file) => file.endsWith(".mdx"))
                .map(async (file) => {
                    try {
                        const mod = await import(
                            `@/app/writings/_writings/${file}`
                        );

                        if (!mod.metadata || mod.metadata.draft) return null;

                        return {
                            slug: file.replace(/\.mdx$/, ""),
                            ...mod.metadata,
                        };
                    } catch {
                        return null;
                    }
                }),
        );

        return NextResponse.json(items);
    } catch {
        return NextResponse.json(
            { error: "Failed to load articles" },
            { status: 500 },
        );
    }
}
