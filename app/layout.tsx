import KeyboardShortcuts from "@/components/keyboard-shortcuts";
import Navbar from "@/components/navbar";
import ViewIncrement from "@/components/view-increment";
import { Analytics } from "@vercel/analytics/next";
import cn from "clsx";
import "katex/dist/katex.min.css";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Lora } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";

const sans = Inter({
    preload: true,
    variable: "--sans",
});

const serif = Lora({
    preload: true,
    variable: "--serif",
    style: "italic",
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
            lang="en"
            className={cn(
                "overflow-x-hidden touch-manipulation",
                sans.variable,
                serif.variable,
                mono.variable,
            )}
        >
            <body
                className={cn(
                    "w-full p-6 sm:p-10 md:p-14",
                    "text-sm leading-6 sm:text-[15px] sm:leading-7 md:text-base md:leading-7",
                    "text-rurikon-500",
                    "antialiased",
                )}
            >
                <KeyboardShortcuts />
                <ViewIncrement />
                <div className="fixed sm:hidden h-6 sm:h-10 md:h-14 w-full top-0 left-0 z-30 pointer-events-none content-fade-out" />
                <div className="flex flex-col mobile:flex-row">
                    <Navbar />
                    <main className="relative flex-1 max-w-2xl contain-[inline-size]">
                        <div className="absolute w-full h-px opacity-50 bg-rurikon-border right-0 mobile:right-auto mobile:left-0 mobile:w-px mobile:h-full mobile:opacity-100 mix-blend-multiply" />
                        <ViewTransition name="crossfade">
                            <article className="pl-0 pt-6 mobile:pt-0 mobile:pl-6 sm:pl-10 md:pl-14">
                                {children}
                            </article>
                        </ViewTransition>
                    </main>
                </div>
                <Analytics />
            </body>
        </html>
    );
}
