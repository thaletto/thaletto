"use client";
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

export const ContributionGraphClient = ({
    contributions,
    totalCount,
}: {
    contributions: Activity[];
    totalCount: Record<string, number>;
}) => (
    <ContributionGraph
        data={contributions}
        totalCount={Object.values(totalCount).reduce((a, b) => a + b, 0)}
        blockSize={10}
        fontSize={12}
    >
        <ContributionGraphCalendar>
            {({ activity, dayIndex, weekIndex }) => (
                <g>
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
                {({ totalCount }) => (
                    <Badge variant="outline">
                        {totalCount.toLocaleString()} contributions
                    </Badge>
                )}
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
