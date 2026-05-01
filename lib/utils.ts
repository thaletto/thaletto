import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getCompanyLogoSrc(company?: string) {
	if (!company) {
		return null;
	}

	switch (company.toLowerCase()) {
		case "tcs":
			return "/company/tcs.svg";
		case "gcp":
			return "/company/gcp.svg";
		default:
			return "/company/office.svg";
	}
}
