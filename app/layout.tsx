import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { list } from "@vercel/blob";

// @ts-expect-error types are not available yet?
import { ViewTransition } from "react";

import cn from "clsx";
import "katex/dist/katex.min.css";
import localFont from "next/font/local";

import Navbar from "@/components/navbar";
import "./globals.css";

const sans = localFont({
    src: "./_fonts/InterVariable.woff2",
    preload: true,
    variable: "--sans",
});

const serif = localFont({
    src: "./_fonts/LoraItalicVariable.woff2",
    preload: true,
    variable: "--serif",
});

const mono = localFont({
    src: "./_fonts/IosevkaFixedCurly-ExtendedMedium.woff2",
    preload: true,
    variable: "--mono",
});

const baseURL = new URL("https://thaletto.vercel.app");

async function getBlobURL() {
    try {
        const { blobs } = await list({ prefix: "images/opengraph/" });
        const imageBlob = blobs.find(
            (blob) => blob.pathname === "images/opengraph/opengraph-image.jpg",
        );
        return imageBlob?.url || null;
    } catch (error) {
        console.error("Error fetching blob URL:", error);
        return null;
    }
}

// Get the blob URL
const ogURL = await getBlobURL();

export const metadata: Metadata = {
    title: {
        template: "%s - Laxman K R",
        default: "Laxman K R - Full Stack AI Developer",
    },
    description: "Full Stack AI Developer",
    metadataBase: baseURL,

    twitter: {
        card: "summary_large_image",
        site: "thaletto.vercel.app",
        creator: "@thaletto",
        title: "thaletto Portfolio & Blog",
        description:
            "Portfolio & Blog website of Laxman K R, a full stack developer",
        images: ogURL ? [ogURL] : [],
    },

    openGraph: {
        images: ogURL
            ? [
                  {
                      url: ogURL,
                      width: 1200,
                      height: 630,
                      alt: "Laxman K R @thaletto",
                  },
              ]
            : [],
        title: "Laxman K R @thaletto",
        description: "Full Stack AI Developer",
        type: "website",
        siteName: "thaletto.vercel.app",
        url: baseURL,
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
        <html lang="en" className="overflow-x-hidden touch-manipulation">
            <body
                className={cn(
                    sans.variable,
                    serif.variable,
                    mono.variable,
                    "w-full p-6 sm:p-10 md:p-14",
                    "text-sm leading-6 sm:text-[15px] sm:leading-7 md:text-base md:leading-7",
                    "text-rurikon-500",
                    "antialiased",
                )}
            >
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
