import { GitHubAchievements } from "./github-achievements";
import GithubActivityCalendar from "./github-calendar";

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
        </div>
    );
}
