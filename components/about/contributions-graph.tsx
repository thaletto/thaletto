"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import {
	ContributionGraph,
	ContributionGraphBlock,
	ContributionGraphCalendar,
	ContributionGraphFooter,
	ContributionGraphLegend,
	ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const HOVER_DELAY_MS = 120;

function formatDate(date: string) {
	return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function ContributionGraphClient({
	contributions,
	totalCount,
}: {
	contributions: Activity[];
	totalCount: Record<string, number>;
}) {
	const totalContributions = useMemo(
		() => Object.values(totalCount).reduce((a, b) => a + b, 0),
		[totalCount]
	);
	const defaultText = `${totalContributions} contributions`;
	const [displayText, setDisplayText] = useState(defaultText);
	const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseEnter = useCallback((activity: Activity) => {
		if (hoverTimer.current) {
			clearTimeout(hoverTimer.current);
		}
		hoverTimer.current = setTimeout(() => {
			const formatted = formatDate(activity.date);
			setDisplayText(
				activity.count
					? `${activity.count} contributions on ${formatted}`
					: `No contributions on ${formatted}`
			);
		}, HOVER_DELAY_MS);
	}, []);

	const handleMouseLeave = useCallback(() => {
		if (hoverTimer.current) {
			clearTimeout(hoverTimer.current);
		}
		setDisplayText(defaultText);
	}, [defaultText]);

	return (
		<ContributionGraph
			blockSize={10}
			data={contributions}
			fontSize={12}
			totalCount={totalContributions}
		>
			<ContributionGraphCalendar className="cursor-pointer">
				{({ activity, dayIndex, weekIndex }) => (
					<g
						aria-label="Github contributions made on the day"
						onMouseEnter={() => handleMouseEnter(activity)}
						onMouseLeave={handleMouseLeave}
						tabIndex={0}
					>
						<ContributionGraphBlock
							activity={activity}
							className={cn(
								"cursor-pointer",
								'data-[level="0"]:fill-[#ebedf0]',
								'data-[level="1"]:fill-[#9be9a8]',
								'data-[level="2"]:fill-[#40c463]',
								'data-[level="3"]:fill-[#30a14e]',
								'data-[level="4"]:fill-[#216e39]'
							)}
							dayIndex={dayIndex}
							weekIndex={weekIndex}
						/>
					</g>
				)}
			</ContributionGraphCalendar>
			<ContributionGraphFooter>
				<ContributionGraphTotalCount>
					{() => <Badge variant="outline">{displayText}</Badge>}
				</ContributionGraphTotalCount>
				<ContributionGraphLegend>
					{({ level }) => (
						<svg
							aria-label={`Contribution level ${level}`}
							height={12}
							role="img"
							width={12}
						>
							<title>{`Contribution level ${level}`}</title>
							<rect
								className={cn(
									"stroke-[1px] stroke-border",
									'data-[level="0"]:fill-[#ebedf0]',
									'data-[level="1"]:fill-[#9be9a8]',
									'data-[level="2"]:fill-[#40c463]',
									'data-[level="3"]:fill-[#30a14e]',
									'data-[level="4"]:fill-[#216e39]'
								)}
								data-level={level}
								height={12}
								rx={2}
								ry={2}
								width={12}
							/>
						</svg>
					)}
				</ContributionGraphLegend>
			</ContributionGraphFooter>
		</ContributionGraph>
	);
}
