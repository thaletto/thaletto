"use client";

import { motion } from "framer-motion";
import type React from "react";
import type { TimelineElement } from "@/types";
import { Timeline, TimelineItem } from "./timeline";

interface TimelineLayoutProps {
	animate?: boolean;
	className?: string;
	connectorColor?: "primary" | "secondary" | "muted" | "accent";
	customIcon?: React.ReactNode;
	iconColor?: "primary" | "secondary" | "muted" | "accent";
	items: TimelineElement[];
	size?: "sm" | "md" | "lg";
}

export const TimelineLayout = ({
	items,
	size = "md",
	iconColor,
	customIcon,
	animate = true,
	connectorColor,
	className,
}: TimelineLayoutProps) => {
	const reversedItems = [...items].reverse();

	return (
		<Timeline className={className}>
			{reversedItems.map((item, index) => (
				<motion.div
					animate={animate ? { opacity: 1, y: 0 } : false}
					initial={animate ? { opacity: 0, y: 20 } : false}
					key={index}
					transition={{
						duration: 0.5,
						delay: index * 0.1,
						ease: "easeOut",
					}}
				>
					<TimelineItem
						content={item.content}
						description={item.description}
						endDate={item.endDate}
						image={item.image}
						nextEndDate={reversedItems[index + 1]?.endDate}
						showConnector={index !== items.length - 1}
						slug={item.slug}
						startDate={item.startDate}
						title={item.title}
					/>
				</motion.div>
			))}
		</Timeline>
	);
};
