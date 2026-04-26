import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
	const dir = path.join(process.cwd(), "app", "writings", "_articles");

	try {
		const files = await fs.readdir(dir);

		const items = await Promise.all(
			files
				.filter((file) => file.endsWith(".mdx"))
				.map(async (file) => {
					try {
						const mod = await import(`@/app/writings/_articles/${file}`);

						if (!mod.metadata || mod.metadata.draft) {
							return null;
						}

						return {
							slug: file.replace(/\.mdx$/, ""),
							...mod.metadata,
						};
					} catch {
						return null;
					}
				})
		);

		return NextResponse.json(items);
	} catch {
		return NextResponse.json(
			{ error: "Failed to load articles" },
			{ status: 500 }
		);
	}
}
