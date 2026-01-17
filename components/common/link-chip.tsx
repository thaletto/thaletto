import Link from "next/link";
import {
    FaFilePdf,
    FaFileWord,
    FaGlobe,
    FaGithub,
    FaXTwitter,
    FaLinkedin,
    FaInstagram,
    FaGoogleDrive,
} from "react-icons/fa6";
import { SiNotion } from "react-icons/si";
import { Badge } from "../ui/badge";

type LinkProps = {
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
};

export default function LinkChip({ icon, label, link }: LinkProps) {
    const renderIcon = () => {
        switch (icon) {
            case "github":
                return <FaGithub size={32}/>;
            case "globe":
                return <FaGlobe className="w-4 h-4" />;
            case "instagram":
                return <FaInstagram className="w-4 h-4" />;
            case "linkedin":
                return <FaLinkedin className="w-4 h-4" />;
            case "notion":
                return <SiNotion className="w-4 h-4" />;
            case "pdf":
                return <FaFilePdf className="w-4 h-4" />;
            case "word":
                return <FaFileWord className="w-4 h-4" />;
            case "X":
                return <FaXTwitter className="w-4 h-4" />;
            case "gdrive":
                return <FaGoogleDrive className="w-4 h-4" />;
            default:
                return <FaGlobe className="w-4 h-4" />;
        }
    };

    return (
        <Link href={link} target="_blank" rel="noopener noreferrer">
            <Badge variant="outline" className="px-2 py-4 text-sm rounded">
                {renderIcon()} {label}
            </Badge>
        </Link>
    );
}
