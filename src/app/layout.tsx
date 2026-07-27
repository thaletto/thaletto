import cn from "clsx";
import { AmbientBackground } from "@/components/ambient-background";
import { AnalyticsCollector } from "@/components/analytics-collector";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";
import Navbar from "@/components/navbar";
import { PublicOnly } from "@/components/public-only";
import { SiteFooter } from "@/components/site-footer";
import "katex/dist/katex.min.css";
import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ViewTransition } from "react";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavSoundTrigger } from "@/lib/sound/trigger";

const serif_to_sans = localFont({
	src: "./fonts/ABCArizona-FlareRegular.otf",
	preload: true,
	variable: "--serif-to-sans",
});

const mono = Geist_Mono({
	preload: true,
	subsets: ["latin"],
	variable: "--mono",
});

const baseURL = new URL("https://thaletto.vercel.app");

export const metadata: Metadata = {
	title: {
		template: "%s - Laxman K R",
		default: "Laxman K R - AI Engineer",
	},
	description: "AI Engineer",
	metadataBase: baseURL,

	openGraph: {
		type: "website",
		siteName: "Laxman K R",
	},

	twitter: {
		card: "summary_large_image",
		creator: "@thaletto",
	},
};

export const viewport: Viewport = {
	maximumScale: 1,
	colorScheme: "only light",
	themeColor: "#fcfcfc",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn(
				"touch-manipulation overflow-x-hidden",
				serif_to_sans.variable,
				mono.variable
			)}
			lang="en"
		>
			<body
				className={cn(
					"w-full",
					"text-sm leading-6 sm:text-[15px] sm:leading-7 md:text-base md:leading-7",
					"antialiased"
				)}
			>
				<TooltipProvider>
					<AmbientBackground />
					<div className="relative z-10 flex min-h-screen flex-col pb-24">
						<main className="flex-1 pt-14">
							<ViewTransition name="crossfade">{children}</ViewTransition>
						</main>
						<PublicOnly>
							<SiteFooter />
						</PublicOnly>
					</div>
					<PublicOnly>
						<Navbar />
					</PublicOnly>
				</TooltipProvider>
				<NavSoundTrigger />
				<KeyboardShortcuts />
				<AnalyticsCollector />
			</body>
		</html>
	);
}
