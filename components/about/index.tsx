import { GitHubAchievements } from "./github-achievements";
import Skills from "./skills";
import LinkChip, { LinkProps } from "../common/link-chip";
import { ContributionGraphClient } from "./contributions-graph";
import { getContributionsData } from "@/lib/actions";

type social_link = {
    name: string;
    icon: LinkProps["icon"];
    link: string;
};

const SOCIAL_LINKS: social_link[] = [
    {
        name: "GitHub",
        icon: "github",
        link: "https://github.com/thaletto/",
    },
    {
        name: "LinkedIn",
        icon: "linkedin",
        link: "https://www.linkedin.com/in/laxmanramesh/",
    },
    {
        name: "Twitter",
        icon: "X",
        link: "https://x.com/thaletto",
    },
    {
        name: "Instagram",
        icon: "instagram",
        link: "https://instagram.com/thaletto",
    },
    {
        name: "Notion",
        icon: "notion",
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
            
            <div className="flex flex-wrap gap-2 md:gap-4 mt-8">
                {SOCIAL_LINKS.map((item) => (
                    <LinkChip
                        variant="link"
                        key={item.name}
                        link={item.link}
                        label={item.name}
                        icon={item.icon}
                    />
                ))}
            </div>
        </div>
    );
}
