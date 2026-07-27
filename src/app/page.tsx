import type { Metadata } from "next";
import About from "@/components/about";
import Hero from "@/components/about/hero";
import ThatsWhatSheSaid from "@/components/about/thats-what-she-said";
import ViewCount from "@/components/about/view-count";
import LinkChip from "@/components/common/link-chip";
import { HomeDoorways, SectionTag } from "@/components/home-doorways";

export const metadata: Metadata = {
	title: "Laxman K R | AI Engineer",
	openGraph: { images: ["/og/home.png"] },
};

export default function HomePage() {
	return (
		<div className="page-column">
			<Hero />

			<div className="home-introduction">
				<p>
					Hey, I’m Laxman, a full-stack developer who enjoys building modern,
					well-structured apps where things just feel right—from how the UI
					looks to how the code is organized under the hood.
				</p>
				<p>
					I’m drawn to system design, application structure, and different
					programming paradigms, with <code>TypeScript</code> as my go-to
					language and <code>Python</code> for AI-driven work. I prefer
					exploring new technologies instead of riding the same stack for so
					long, <ThatsWhatSheSaid />.
				</p>
			</div>

			<HomeDoorways />

			<section className="home-section">
				<SectionTag index="01">Signals</SectionTag>
				<About />
			</section>

			<section className="home-section">
				<SectionTag index="02">Résumé</SectionTag>
				<p className="mt-5 text-muted-foreground">
					A concise record of my engineering work, education, and current
					technical focus.
				</p>
				<LinkChip
					className="my-1 font-semibold text-base md:text-lg"
					icon="pdf"
					label="Open résumé"
					link="/cv"
					variant="link"
				/>
			</section>

			<section className="home-section">
				<SectionTag index="03">Visitors</SectionTag>
				<div className="mt-5">
					<ViewCount />
				</div>
			</section>
		</div>
	);
}
