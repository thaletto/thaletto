"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { GitHubCalendar } from "react-github-calendar";

export default function GithubActivityCalendar() {
    const isMobile = useIsMobile();
    return (
        <GitHubCalendar
            username="thaletto"
            blockMargin={2}
            blockRadius={20}
            blockSize={isMobile ? 4 : 8}
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
