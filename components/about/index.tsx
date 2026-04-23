import { GitHubAchievements } from "./github-achievements";
import Skills from "./skills";
import { ContributionGraphClient } from "./contributions-graph";
import { getContributionsData } from "@/lib/actions";
import {
    FaGithub,
    FaLinkedin,
    FaXTwitter,
    FaInstagram,
} from "react-icons/fa6";
import { SiNotion } from "react-icons/si";
import Link from "next/link";

type social_link = {
    name: string;
    icon: React.ReactNode;
    link: string;
};

const SOCIAL_LINKS: social_link[] = [
    {
        name: "GitHub",
        icon: <FaGithub className="size-5" />,
        link: "https://github.com/thaletto/",
    },
    {
        name: "LinkedIn",
        icon: <FaLinkedin className="size-5" />,
        link: "https://www.linkedin.com/in/laxmanramesh/",
    },
    {
        name: "Twitter",
        icon: <FaXTwitter className="size-5" />,
        link: "https://x.com/thaletto",
    },
    {
        name: "Instagram",
        icon: <FaInstagram className="size-5" />,
        link: "https://instagram.com/thaletto",
    },
    {
        name: "Notion",
        icon: <SiNotion className="size-5" />,
        link: "https://laxmankr.notion.site/54f72abb3cf348a7902c48a41fe0d48a?v=68aa5ecbfa7947609269a0f777fdad7f",
    },
];

export default async function About() {
    const contributionData = await getContributionsData();
    return (
        <div>
            <div className=" flex flex-col gap-y-2 my-8">
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
                    {SOCIAL_LINKS.map((item, index) => (
                        <Link
                            key={item.name}
                            className="flex items-center justify-center p-3 text-muted-foreground transition-[color] hover:text-foreground first:rounded-l-md last:rounded-r-md border-y border-r border-border first:border-l"
                            href={item.link}
                            target="_blank"
                            rel="noopener"
                            aria-label={item.name}
                        >
                            {item.icon}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
