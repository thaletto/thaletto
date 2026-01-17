'use client';
import { formatDate } from "@/lib/date";
import { GitHubCalendar } from "react-github-calendar";

export default function GithubActivityCalendar() {
    return (
        <GitHubCalendar
            username="thaletto"
            blockMargin={2}
            blockRadius={20}
            blockSize={9.5}
            colorScheme="light"
            fontSize={12}
            showMonthLabels={false}
            showTotalCount={true}
            showWeekdayLabels={false}
            showColorLegend={true}
            maxLevel={10}
            tooltips={{
                activity: {
                    text: (activity) => `${activity.count} contribution on ${formatDate(activity.date, 'DDMMM', ' ')}`,
                    placement: "top",
                    offset: 6,
                    hoverRestMs: 300,
                    transitionStyles: {
                        duration: 100,
                    },
                    withArrow: true,
                },
            }}
        />
    );
}
