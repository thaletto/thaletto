import type { ReactNode } from "react";
import { Card } from "@/components/common/card";
import SvgIcon from "@/components/common/logo";
import { Badge } from "@/components/ui/badge";
import { getCompanyLogoSrc } from "@/lib/utils";
import { formatDate } from "@/lib/date";

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

	// Parse dates for display
	const startDate = formatDate(metadata.startDate, "MMMYYYY");
	const endDate = metadata.endDate
		? formatDate(metadata.endDate, "MMMYYYY")
		: "Present";

	return (
		<article className="mx-auto max-w-3xl">
			<header className="mb-8 flex flex-col gap-2">
				<div className="flex items-center gap-2">
					{companyIcon && (
						<SvgIcon
							className="size-8 shrink-0 text-muted-foreground group-hover:text-foreground md:size-10"
							name={metadata?.company ?? ""}
							src={companyIcon}
						/>
					)}
					<h1 className="text-balance font-semibold text-xl md:text-3xl">
						{metadata.title}
					</h1>
				</div>

				<p className="font-serif text-sm">
					{startDate} &rarr; {endDate === "Present" ? "Present" : endDate}
				</p>

				<Card image={metadata.image} title={metadata?.imageLabel} />

				<p>{metadata?.description}</p>

				{metadata?.tags.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{metadata?.tags.map((tag: string) => (
							<Badge
								className="rounded-sm px-2 py-0.5 text-xs"
								key={tag}
								variant="default"
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
