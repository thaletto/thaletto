import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
	const dir = path.join(process.cwd(), "app", "timeline", "_timeline");

	try {
		const files = await fs.readdir(dir);

		const items = await Promise.all(
			files
				.filter((file) => file.endsWith(".mdx"))
				.map(async (file) => {
					try {
						const mod = await import(`@/app/timeline/_timeline/${file}`);

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
			{ error: "Failed to load timeline item" },
			{ status: 500 },
		);
	}
}
