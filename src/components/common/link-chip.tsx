import Link from "next/link";
import { FaFilePdf } from "react-icons/fa";
import {
	FaFileWord,
	FaGithub,
	FaGlobe,
	FaGoogleDrive,
	FaInstagram,
	FaLinkedin,
	FaXTwitter,
} from "react-icons/fa6";
import { SiNotion } from "react-icons/si";
import { Badge } from "../ui/badge";

export interface LinkProps {
	className?: string;
	icon?:
		| "gdrive"
		| "github"
		| "globe"
		| "instagram"
		| "linkedin"
		| "notion"
		| "pdf"
		| "word"
		| "X"
		| null;
	label: string;
	link: string;
	variant?:
		| "outline"
		| "link"
		| "default"
		| "secondary"
		| "destructive"
		| "ghost"
		| null
		| undefined;
}

export default function LinkChip({
	icon,
	label,
	link,
	variant = "outline",
	className,
}: LinkProps) {
	const renderIcon = () => {
		switch (icon) {
			case "github":
				return <FaGithub size={32} />;
			case "globe":
				return <FaGlobe className="h-4 w-4" />;
			case "instagram":
				return <FaInstagram className="h-4 w-4" />;
			case "linkedin":
				return <FaLinkedin className="h-4 w-4" />;
			case "notion":
				return <SiNotion className="h-4 w-4" />;
			case "pdf":
				return <FaFilePdf className="h-4 w-4" />;
			case "word":
				return <FaFileWord className="h-4 w-4" />;
			case "X":
				return <FaXTwitter className="h-4 w-4" />;
			case "gdrive":
				return <FaGoogleDrive className="h-4 w-4" />;
			default:
				return <FaGlobe className="h-4 w-4" />;
		}
	};
	const px = variant === "link" ? "px-0" : "px-2";
	return (
		<Link href={link} rel="noopener noreferrer" target="_blank">
			<Badge
				className={`rounded py-4 text-sm ${px} ${className}`}
				variant={variant}
			>
				{renderIcon()} {label}
			</Badge>
		</Link>
	);
}
