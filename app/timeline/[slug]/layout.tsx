import type { ReactNode } from "react";
import { Card } from "@/components/common/card";
import { formatDate } from "@/lib/date";

export default async function Layout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const { metadata } = await import(`../_timeline/${slug}.mdx`);

	// Parse dates for display
	const startDate = formatDate(metadata.startDate, "MMMYYYY");
	const endDate = metadata.endDate
		? formatDate(metadata.endDate, "MMMYYYY")
		: "Present";

	return (
		<article className="mx-auto max-w-3xl">
			<header className="mb-8 flex flex-col gap-2">
				<h1 className="text-balance font-semibold text-xl md:text-3xl">
					{metadata.title}
				</h1>
				<p className="font-serif text-sm">
					{startDate} &rarr; {endDate === "Present" ? "Present" : endDate}
				</p>
			</header>
			{metadata.image && (
				<Card image={metadata.image} title={metadata?.imageLabel} />
			)}
			{children}
		</article>
	);
}
