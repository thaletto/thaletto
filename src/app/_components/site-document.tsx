import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import {
  RouteMotionController,
  RouteViewTransition,
} from '~/components/motion/route-motion-controller'
import { AmbientBackground } from '~/components/shell/ambient-background'
import { ThemeProvider } from '~/components/shell/theme-provider'
import { PreviewCardTimingProvider } from '~/components/social/preview-card-timing'
import { siteIdentity } from '~/lib/content/personal'
import { seo } from '~/lib/metadata/seo'
import { cn } from '~/lib/platform/utils'
import { PREPAINT_SCRIPT } from '~/lib/security/inline-scripts'

import { fontVariables } from '../fonts'

export const rootMetadata: Metadata = {
  metadataBase: seo.url,
  title: {
    default: siteIdentity.name,
    template: `%s | ${siteIdentity.name}`,
  },
}

export async function SiteDocument({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-route-motion="none"
      suppressHydrationWarning
      className={cn('font-sans', fontVariables, 'public-site')}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <PreviewCardTimingProvider>
            <RouteMotionController />
            <AmbientBackground />
            <div className="flex min-h-screen flex-col pb-20">
              <main className="flex-1 pt-14">
                {/* The non-none default isolates route content while keeping the
                    CSS-named list → loading shell → article groups active. */}
                <RouteViewTransition>{children}</RouteViewTransition>
              </main>
            </div>
          </PreviewCardTimingProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
