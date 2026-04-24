"use client";

import { useState } from "react";
import { getViewData, type ViewData } from "@/lib/views";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { FaEye } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
    views: {
        label: "Views",
        color: "hsl(var(--chart-1))",
    },
} satisfies import("@/components/ui/chart").ChartConfig;

export default function ViewsDashboardClient({
    initialData,
}: {
    initialData: ViewData;
}) {
    const [selectedPage, setSelectedPage] = useState("all");
    const [viewData, setViewData] = useState(initialData);
    const [isPending, setIsPending] = useState(false);

    const handlePageChange = async (page: string | null) => {
        if (!page) return;
        setSelectedPage(page);
        setIsPending(true);
        try {
            const data = await getViewData(page === "all" ? undefined : page);
            setViewData(data);
        } finally {
            setIsPending(false);
        }
    };

    const total = viewData.globalTotal;

    return (
        <div className="container py-2 h-[87vh]">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Views Dashboard</h1>
                    <p className="text-muted-foreground">
                        Track page views over the last 90 days
                    </p>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center justify-between w-full">
                            <Select
                                value={selectedPage}
                                onValueChange={handlePageChange}
                            >
                                <SelectTrigger className="w-50">
                                    <SelectValue placeholder="Select page" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Pages
                                    </SelectItem>
                                    <SelectItem value="/">Home</SelectItem>
                                    <SelectItem value="/about">
                                        About
                                    </SelectItem>
                                    <SelectItem value="/writings">
                                        Writings
                                    </SelectItem>
                                    <SelectItem value="/projects">
                                        Projects
                                    </SelectItem>
                                    <SelectItem value="/timeline">
                                        Timeline
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2 text-lg">
                                <FaEye />
                                <span className="font-semibold">
                                    {total.toLocaleString()}
                                </span>
                                <span className="text-muted-foreground">
                                    total views
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isPending ? (
                            <div className="flex items-center justify-center h-75">
                                <Skeleton />
                            </div>
                        ) : (
                            <ChartContainer
                                config={chartConfig}
                                className="h-full w-full"
                            >
                                <AreaChart data={viewData.chartData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border/50"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => {
                                            const d = new Date(value);
                                            return `${d.getMonth() + 1}/${d.getDate()}`;
                                        }}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <ChartTooltip
                                        labelFormatter={(label) => {
                                            const d = new Date(label);
                                            return d.toLocaleDateString();
                                        }}
                                        formatter={(value) => [
                                            Number(value).toLocaleString(),
                                            "Views",
                                        ]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="views"
                                        stroke="var(--color-views)"
                                        fill="var(--color-views)"
                                        fillOpacity={0.2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
