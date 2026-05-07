"use client";

import { motion } from "framer-motion";
import type React from "react";
import type { TimelineElement } from "@/types";
import { Timeline, TimelineItem } from "./timeline";

interface TimelineLayoutProps {
	_connectorColor?: "primary" | "secondary" | "muted" | "accent";
	_customIcon?: React.ReactNode;
	_iconColor?: "primary" | "secondary" | "muted" | "accent";
	_size?: "sm" | "md" | "lg";
	animate?: boolean;
	className?: string;
	items: TimelineElement[];
}

export const TimelineLayout = ({
	items,
	_size = "md",
	_iconColor,
	_customIcon,
	animate = true,
	_connectorColor,
	className,
}: TimelineLayoutProps) => {
	const reversedItems = [...items].reverse();

	return (
		<Timeline className={className}>
			{reversedItems.map((item, index) => (
				<motion.div
					animate={animate ? { opacity: 1, y: 0 } : false}
					initial={animate ? { opacity: 0, y: 20 } : false}
					// biome-ignore lint/suspicious/noArrayIndexKey: fine
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
