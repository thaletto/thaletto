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
                return <FaGithub className="w-4 h-4" />;
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
        <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex p-2 rounded items-center gap-2 text-sm font-medium border hover:bg-rurikon-600 hover:text-rurikon-50 transition-colors duration-300 ease-in-out"
        >
            {renderIcon()}
            <span>{label}</span>
        </Link>
    );
}
