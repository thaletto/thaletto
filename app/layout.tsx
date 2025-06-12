import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './global.css';
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
const ogURL = 'https://ihyabdqqn0nd2hvz.public.blob.vercel-storage.com/images/opengraph/opengraph-image.jpg'

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
    images: [ogURL],
  },

  openGraph: {
    images: [
      {
        url: ogURL,
        width: 1200,
        height: 630,
        alt: 'Laxman K R @thaletto'
      },
    ],
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
      <body className={`${geist.variable} ${geistMono.variable} tracking-tight antialiased`}>
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          {/* Themed Background Layer */}
          <div>
            {/* Light Mode Background */}
            <div
              className="fixed inset-0 -z-50 bg-cover bg-no-repeat bg-blend-overlay dark:hidden"
              style={{
                backgroundImage: `
                  linear-gradient(rgb(242, 237, 234) 100px, rgba(242, 237, 234, 0) 360px),
                  linear-gradient(
                    rgba(41, 37, 114, 0.9) 25%,
                    rgba(100, 103, 150, 0.9) 66%,
                    rgba(100, 90, 145, 0.9) 100%
                  ),
                  url('/noise.png')
                `,
                backgroundColor: 'rgba(217, 217, 217, 0.9)',
              }}
            />

            {/* Dark Mode Background */}
            <div
              className="fixed inset-0 -z-50 bg-cover bg-no-repeat bg-blend-overlay hidden dark:block"
              style={{
                backgroundImage: `
                  linear-gradient(rgb(0, 96, 96) 100px, rgba(0, 224, 224, 0) 360px),
                  linear-gradient(
                    rgba(0, 160, 160, 0.9) 25%,
                    rgba(0, 192, 192, 0.9) 66%,
                    rgba(0, 128, 128, 0.9) 100%
                  ),
                  url('/noise.png')
                `,
                backgroundColor: 'rgba(48, 48, 48, 0.9)',
              }}
            />
          </div>

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
