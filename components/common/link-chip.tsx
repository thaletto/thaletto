import Link from "next/link";
import SvgIcon from "@/components/common/logo";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

type LinkProps = {
    icon?: "github" | null;
    label: string;
    link: string;
};

export default function LinkChip({ icon, label, link }: LinkProps) {
    return (
        <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
            {icon === "github" ? (
                <SvgIcon name="github" width={16} height={16} />
            ) : (
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            )}
            <span>{label}</span>
        </Link>
    );
}
