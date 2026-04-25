"use client";
import { useState, useCallback, useMemo, useRef } from "react";
import {
	ContributionGraph,
	ContributionGraphBlock,
	ContributionGraphCalendar,
	ContributionGraphFooter,
	ContributionGraphLegend,
	ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const HOVER_DELAY_MS = 120;

function formatDate(date: string) {
	return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
		month: "long",
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
		[totalCount],
	);
	const defaultText = `${totalContributions} contributions`;
	const [displayText, setDisplayText] = useState(defaultText);
	const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseEnter = useCallback((activity: Activity) => {
		if (hoverTimer.current) clearTimeout(hoverTimer.current);
		hoverTimer.current = setTimeout(() => {
			const formatted = formatDate(activity.date);
			setDisplayText(
				activity.count
					? `${activity.count} contributions on ${formatted}`
					: `No contributions on ${formatted}`,
			);
		}, HOVER_DELAY_MS);
	}, []);

	const handleMouseLeave = useCallback(() => {
		if (hoverTimer.current) clearTimeout(hoverTimer.current);
		setDisplayText(defaultText);
	}, [defaultText]);

	return (
		<ContributionGraph
			data={contributions}
			totalCount={totalContributions}
			blockSize={10}
			fontSize={12}
		>
			<ContributionGraphCalendar className="cursor-pointer">
				{({ activity, dayIndex, weekIndex }) => (
					<g
						onMouseEnter={() => handleMouseEnter(activity)}
						onMouseLeave={handleMouseLeave}
					>
						<ContributionGraphBlock
							activity={activity}
							dayIndex={dayIndex}
							weekIndex={weekIndex}
							className={cn(
								"cursor-pointer",
								'data-[level="0"]:fill-[#ebedf0]',
								'data-[level="1"]:fill-[#9be9a8]',
								'data-[level="2"]:fill-[#40c463]',
								'data-[level="3"]:fill-[#30a14e]',
								'data-[level="4"]:fill-[#216e39]',
							)}
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
						<svg height={12} width={12}>
							<rect
								className={cn(
									"stroke-[1px] stroke-border",
									'data-[level="0"]:fill-[#ebedf0]',
									'data-[level="1"]:fill-[#9be9a8]',
									'data-[level="2"]:fill-[#40c463]',
									'data-[level="3"]:fill-[#30a14e]',
									'data-[level="4"]:fill-[#216e39]',
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
