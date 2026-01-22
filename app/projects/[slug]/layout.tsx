import { ReactNode } from "react";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/ui/badge";
import SvgIcon from "@/components/common/logo";

function getCompanyLogoSrc(company?: string) {
    if (!company) return null;

    switch (company.toLowerCase()) {
        case "tcs":
            return "/company/tcs.svg";
        default:
            return "/company/office.svg";
    }
}

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

    return (
        <article className="max-w-3xl mx-auto">
            <header className="flex flex-col">
                <div className="flex items-center gap-2">
                    {companyIcon && (
                    <SvgIcon
                        src={companyIcon}
                        name={metadata?.company ?? ""}
                        className="size-8 md:size-10 shrink-0 text-rurikon-400 group-hover:text-rurikon-600"
                    />
                    )}
                    <h1 className="font-semibold text-xl md:text-3xl text-rurikon-600 text-balance">
                        {metadata.title}
                    </h1>
                </div>

                <Card image={metadata.image} title={metadata?.imageLabel} />
                {metadata?.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {metadata?.tags.map((tag: string, index: number) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs px-2 py-0.5 rounded-sm"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </header>
            {children}
        </article>
    );
}
