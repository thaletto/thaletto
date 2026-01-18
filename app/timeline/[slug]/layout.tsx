import { ReactNode } from "react";
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
        <article className="max-w-3xl mx-auto">
            <header className="flex flex-col  mb-8 gap-2">
                <h1 className="font-semibold text-xl md:text-3xl text-rurikon-600 text-balance">
                    {metadata.title}
                </h1>
                <p className="text-sm font-serif">
                    {startDate} &rarr;{" "}
                    {endDate === "Present" ? "Present" : endDate}
                </p>
            </header>
            {metadata.image && (
                <Card image={metadata.image} title={metadata?.imageLabel} />
            )}
            {children}
        </article>
    );
}
