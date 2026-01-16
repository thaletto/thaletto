import { GitHubCalendar } from "react-github-calendar";

export default function GithubActivityCalendar() {
    return (
        <GitHubCalendar
            username="thaletto"
            blockMargin={2}
            blockRadius={20}
            blockSize={8}
            colorScheme="light"
            fontSize={12}
            maxLevel={10}
            showMonthLabels={false}
            showTotalCount={true}
            showWeekdayLabels={false}
            showColorLegend={true}
        />
    );
}
