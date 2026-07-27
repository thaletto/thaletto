import { BriefcaseBusiness, Clock3, PenLine } from "lucide-react";
import Link from "next/link";

const ITEMS = [
	{
		description: "Selected systems and products",
		href: "/projects",
		icon: BriefcaseBusiness,
		label: "Projects",
	},
	{
		description: "Work and education",
		href: "/timeline",
		icon: Clock3,
		label: "Timeline",
	},
	{
		description: "Notes on software and design",
		href: "/writings",
		icon: PenLine,
		label: "Writings",
	},
] as const;

export function HomeDoorways() {
	return (
		<nav aria-label="Explore the portfolio" className="home-doorways">
			{ITEMS.map(({ description, href, icon: Icon, label }) => (
				<Link className="doorway-card" href={href} key={href}>
					<span aria-hidden className="doorway-vignette">
						<Icon />
					</span>
					<span className="font-medium">{label}</span>
					<span className="text-muted-foreground text-xs">{description}</span>
				</Link>
			))}
		</nav>
	);
}

export function SectionTag({
	children,
	index,
}: {
	children: React.ReactNode;
	index: string;
}) {
	return (
		<h2 className="section-tag">
			<span className="section-tag-index">{index}</span>
			<span aria-hidden className="section-tag-rule" />
			<span>{children}</span>
		</h2>
	);
}
