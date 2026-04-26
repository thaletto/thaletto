export type TimelineSize = "sm" | "md" | "lg";
export type TimelineStatus = "completed" | "in-progress" | "pending";
export type TimelineColor =
	| "primary"
	| "secondary"
	| "muted"
	| "accent"
	| "destructive";

export interface TimelineElement {
	content?: React.ReactNode;
	date: string;
	description?: string;
	endDate: string;
	id: number;
	image?: string;
	slug?: string;
	startDate: string;
	title: string;
}

export interface TimelineProps {
	animate?: boolean;
	className?: string;
	connectorColor?: TimelineColor;
	iconColor?: TimelineColor;
	items: TimelineElement[];
	size?: TimelineSize;
}
