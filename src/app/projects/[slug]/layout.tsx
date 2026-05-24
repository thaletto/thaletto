import type { ReactNode } from "react";
import { Card } from "@/components/common/card";
import SvgIcon from "@/components/common/logo";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import { getCompanyLogoSrc } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Layout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { metadata } = await import(`../_projects/${slug}.mdx`);
    const companyIcon = getCompanyLogoSrc(metadata?.company);

    const startDate = formatDate(metadata.startDate, "MMMYYYY");
    const endDate = metadata.endDate
        ? formatDate(metadata.endDate, "MMMYYYY")
        : "Present";

    return (
        <article className="mx-auto max-w-3xl">
            <header className="mb-8 flex flex-col gap-4">
                {/* Identity: company + title + date */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        {companyIcon && (
                            <SvgIcon
                                className="size-8 shrink-0 text-muted-foreground md:size-10"
                                name={metadata?.company ?? ""}
                                src={companyIcon}
                            />
                        )}
                        <h1 className="text-balance font-semibold text-xl md:text-3xl">
                            {metadata.title}
                        </h1>
                    </div>
                    <p className="font-serif text-sm text-muted-foreground">
                        {startDate} &rarr; {endDate}
                    </p>
                </div>
                {/* Description */}
                {metadata?.description && (
                    <p className="text-muted-foreground leading-relaxed">
                        {metadata.description}
                    </p>
                )}
                {/* Hero image */}
                <Card image={metadata.image} title={metadata?.imageLabel} />
                {/* Tags + Links */}
                {(metadata?.tags?.length > 0 ||
                    metadata?.links?.length > 0) && (
                    <div className="flex flex-col gap-2">
                        {metadata?.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {metadata?.tags?.map((tag: string) => (
                                    <Badge
                                        className="rounded-sm px-2 py-1 text-sm"
                                        key={tag}
                                        variant="secondary"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {metadata?.links?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {metadata?.links?.map(
                                    (link: { label: string; url: string }) => (
                                        <Button
                                            key={link.url}
                                            variant="default"
                                            size="lg"
                                            className='cursor-pointer'
                                        >
                                            <ExternalLink className="size-4" />
                                            {link.label}
                                        </Button>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                )}{" "}
            </header>

            {children}
        </article>
    );
}
