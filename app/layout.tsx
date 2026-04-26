import { Analytics } from "@vercel/analytics/next";
import cn from "clsx";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";
import Navbar from "@/components/navbar";
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
					"w-full p-6 sm:p-10 md:p-12",
					"text-sm leading-6 sm:text-[15px] sm:leading-7 md:text-base md:leading-7",
					"antialiased"
				)}
			>
				<TooltipProvider>
					<div className="pointer-events-none fixed top-0 left-0 z-30 h-6 w-full content-fade-out sm:hidden sm:h-10 md:h-14" />
					<div className="flex mobile:flex-row flex-col">
						<Navbar />
						{/* MAX WIDTH 3.25XL (832px) */}
						<main className="contain-[inline-size] relative max-w-208 flex-1">
							<div className="absolute mobile:right-auto right-0 mobile:left-0 h-px mobile:h-full mobile:w-px w-full bg-border" />
							<ViewTransition name="crossfade">
								<article className="mobile:pt-0 pt-6 mobile:pl-6 pl-0 sm:pl-10 md:pl-14">
									{children}
								</article>
							</ViewTransition>
						</main>
					</div>
				</TooltipProvider>
				<NavSoundTrigger />
				<KeyboardShortcuts />
				<Analytics />
			</body>
		</html>
	);
}
