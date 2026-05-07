import type { ReactNode } from "react";

export default async function Layout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const { metadata } = await import(`../_articles/${slug}.mdx`);

	return (
		<article className="mx-auto max-w-3xl">
			<header className="mb-8 flex flex-col gap-2">
				<h1 className="text-balance font-semibold text-xl md:text-3xl">
					{metadata.title}
				</h1>
				<p className="font-serif text-sm">
					{metadata.authors.name} &bull; {metadata.date}
				</p>
			</header>
			{children}
		</article>
	);
}
