import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

const baseURL = new URL('https://thaletto.vercel.app');

export const metadata: Metadata = {
  title: {
    template: '%s - @thaletto',
    default: 'Laxman K R - @thaletto',
  },
  description: 'Full Stack AI Developer',
  metadataBase: baseURL,

  twitter: {
    card: 'summary_large_image',
    site: 'thaletto.vercel.app',
    creator: '@thaletto',
    title: 'thaletto Portfolio & Blog',
    description: 'Portfolio & Blog website of Laxman K R, a full stack developer',
    images: ['opengraph-image.jpg'],
  },

  openGraph: {
    images: ['opengraph-image.jpg'],
    title: 'Laxman K R @thaletto',
    description: 'Full Stack AI Developer',
    type: 'website',
    siteName: 'thaletto.vercel.app',
    url: baseURL,
  },
};

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-lg flex-1 px-4 pt-20">
              <Header />
              {children}
              <Analytics />
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
