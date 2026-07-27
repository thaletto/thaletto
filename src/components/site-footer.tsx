import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { SiNotion } from "react-icons/si";
import ViewCount from "@/components/about/view-count";

const CONTACTS = [
	{ href: "https://github.com/thaletto/", icon: FaGithub, label: "GitHub" },
	{
		href: "https://www.linkedin.com/in/laxmanramesh/",
		icon: FaLinkedin,
		label: "LinkedIn",
	},
	{ href: "https://x.com/thaletto", icon: FaXTwitter, label: "X" },
	{
		href: "https://instagram.com/thaletto",
		icon: FaInstagram,
		label: "Instagram",
	},
	{
		href: "https://laxmankr.notion.site/54f72abb3cf348a7902c48a41fe0d48a?v=68aa5ecbfa7947609269a0f777fdad7f",
		icon: SiNotion,
		label: "Notion",
	},
] as const;

const INDEX = [
	{ href: "/", label: "About" },
	{ href: "/projects", label: "Projects" },
	{ href: "/timeline", label: "Timeline" },
	{ href: "/writings", label: "Writings" },
	{ href: "/cv", label: "Résumé" },
] as const;

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="footer-grid">
				<div className="footer-colophon">
					<div>
						<p>© {new Date().getFullYear()} Laxman K R</p>
						<p className="text-muted-foreground">AI Engineer</p>
					</div>
					<ViewCount />
				</div>
				<div>
					<h2 className="footer-label">Contact</h2>
					<ul className="footer-tree">
						{CONTACTS.map(({ href, icon: Icon, label }) => (
							<li key={href}>
								<a href={href} rel="noreferrer" target="_blank">
									<Icon aria-hidden className="size-3.5" />
									{label}
								</a>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h2 className="footer-label">Index</h2>
					<ul className="footer-tree">
						{INDEX.map(({ href, label }) => (
							<li key={href}>
								<Link href={href}>{label}</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
}
