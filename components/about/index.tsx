import { GitHubAchievements } from "./github-achievements";
import GithubActivityCalendar from "./github-calendar";
import Skills from "./skills";

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
        </div>
    );
}
