import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { MDX_REGEX } from "@/lib/const";

export async function GET() {
	const dir = path.join(process.cwd(), "src", "app", "projects", "_projects");

	try {
		const files = await fs.readdir(dir);

		const items = await Promise.all(
			files
				.filter((file) => file.endsWith(".mdx"))
				.map(async (file) => {
					try {
						const mod = await import(`@/app/projects/_projects/${file}`);

						if (!mod.metadata || mod.metadata.draft) {
							return null;
						}

						return {
							slug: file.replace(MDX_REGEX, ""),
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
			{ error: "Failed to load projects" },
			{ status: 500 }
		);
	}
}
