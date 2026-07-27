import type { Metadata } from "next";

export const metadata: Metadata = {
	robots: { follow: false, index: false },
	title: "Analytics admin",
};

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="admin-shell">{children}</div>;
}
