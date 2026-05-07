import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	context: { params: Promise<{ slug: string }> }
) {
	const { slug } = await context.params;

	try {
		const { metadata } = await import(`@/app/projects/_projects/${slug}.mdx`);

		if (!metadata || metadata.draft) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		return NextResponse.json(metadata);
	} catch {
		return NextResponse.json({ error: "Project not found" }, { status: 404 });
	}
}
