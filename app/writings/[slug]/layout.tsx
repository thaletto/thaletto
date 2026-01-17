import { ReactNode } from "react";

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
        <article className="max-w-3xl mx-auto">
            <header className="flex flex-col mb-8 gap-2">
                <h1 className="font-semibold text-xl md:text-3xl text-rurikon-600 text-balance">
                    {metadata.title}
                </h1>
                <p className="text-sm font-serif">
                    {metadata.authors.name} &bull; {metadata.date}
                </p>
            </header>
            {children}
        </article>
    );
}
