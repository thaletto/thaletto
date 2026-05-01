import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { SiNotion } from "react-icons/si";
import { getContributionsData } from "@/lib/actions";
import { ContributionGraphClient } from "./contributions-graph";
import { GitHubAchievements } from "./github-achievements";
import Skills from "./skills";

interface social_link {
	icon: React.ReactNode;
	link: string;
	name: string;
}

const SOCIAL_LINKS: social_link[] = [
	{
		name: "GitHub",
		icon: <FaGithub className="size-4 md:size-5" />,
		link: "https://github.com/thaletto/",
	},
	{
		name: "LinkedIn",
		icon: <FaLinkedin className="size-4 md:size-5" />,
		link: "https://www.linkedin.com/in/laxmanramesh/",
	},
	{
		name: "Twitter",
		icon: <FaXTwitter className="size-4 md:size-5" />,
		link: "https://x.com/thaletto",
	},
	{
		name: "Instagram",
		icon: <FaInstagram className="size-4 md:size-5" />,
		link: "https://instagram.com/thaletto",
	},
	{
		name: "Notion",
		icon: <SiNotion className="size-4 md:size-5" />,
		link: "https://laxmankr.notion.site/54f72abb3cf348a7902c48a41fe0d48a?v=68aa5ecbfa7947609269a0f777fdad7f",
	},
];

export default async function About() {
	const contributionData = await getContributionsData();
	return (
		<div>
			<div className="my-8 flex flex-col gap-y-2">
				<ContributionGraphClient
					contributions={contributionData.contributions}
					totalCount={contributionData.total}
				/>

				<GitHubAchievements
					galaxyBrain={1}
					pairExtraordinaire={1}
					pullShark={2}
					quickDraw={1}
				/>
			</div>

			<Skills className="my-8" />

			<div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
				<div className="flex items-center -space-x-px">
					{SOCIAL_LINKS.map((item, _index) => (
						<Link
							aria-label={item.name}
							className="flex items-center justify-center border-border border-y border-r p-3 text-muted-foreground transition-[color] first:rounded-l-md first:border-l last:rounded-r-md hover:text-foreground"
							href={item.link}
							key={item.name}
							rel="noopener"
							target="_blank"
						>
							{item.icon}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
