import { GitHubAchievements } from "./github-achievements";
import GithubActivityCalendar from "./github-calendar";
import Skills from "./skills";
import LinkChip, { LinkProps } from "../common/link-chip";

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

export default function About() {
    return (
        <div>
            <GithubActivityCalendar />
            <GitHubAchievements
                galaxyBrain={1}
                pairExtraordinaire={1}
                pullShark={2}
                quickDraw={1}
                className="mt-2"
            />
            <Skills className="mt-8" />
            <div className="flex flex-wrap gap-4 mt-8">
                {SOCIAL_LINKS.map((item) => (
                    <LinkChip variant='link' key={item.name} link={item.link} label={item.name} icon={item.icon}  />
                ))}
            </div>
        </div>
    );
}
