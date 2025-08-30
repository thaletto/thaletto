import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './global.css';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Analytics } from '@vercel/analytics/next';
import { list } from '@vercel/blob';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

const baseURL = new URL('https://thaletto.vercel.app');

async function getBlobURL() {
  try {
    const { blobs } = await list({ prefix: 'images/opengraph/' });
    const imageBlob = blobs.find(
      (blob) => blob.pathname === 'images/opengraph/opengraph-image.jpg'
    );
    return imageBlob?.url || null;
  } catch (error) {
    console.error('Error fetching blob URL:', error);
    return null;
  }
}

// Get the blob URL
const ogURL = await getBlobURL();

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
    description:
      'Portfolio & Blog website of Laxman K R, a full stack developer',
    images: ogURL ? [ogURL] : [],
  },

  openGraph: {
    images: ogURL
      ? [
          {
            url: ogURL,
            width: 1200,
            height: 630,
            alt: 'Laxman K R @thaletto',
          },
        ]
      : [],
    title: 'Laxman K R @thaletto',
    description: 'Full Stack AI Developer',
    type: 'website',
    siteName: 'thaletto.vercel.app',
    url: baseURL,
  },
};

const geist = Geist({
  variable: '--font-sans',
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
        className={`${geist.variable} font-sans tracking-tight antialiased`}
      >
        {/* Themed Background Layer */}
        <div className="relative min-h-screen w-full">
          <div
            className="absolute inset-0 z-0"
            style={{
              background: `
                  url('/noise.png'),
                  radial-gradient(ellipse 80% 60% at 5% 40%, rgba(175, 109, 255, 0.48), transparent 67%),
                  radial-gradient(ellipse 70% 60% at 45% 45%, rgba(255, 100, 180, 0.41), transparent 67%),
                  radial-gradient(ellipse 62% 52% at 83% 76%, rgba(255, 235, 170, 0.44), transparent 63%),
                  radial-gradient(ellipse 60% 48% at 75% 20%, rgba(120, 190, 255, 0.36), transparent 66%),
                  linear-gradient(45deg, #f7eaff 0%, #fde2ea 100%)
                `,
              backgroundBlendMode: 'overlay, normal',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
            }}
          />

          <div className="flex min-h-screen w-full flex-col">
            <div className="relative mx-auto w-full max-w-screen-lg flex-1 px-4 pt-20">
              <Header />
              {children}
              <Analytics />
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
