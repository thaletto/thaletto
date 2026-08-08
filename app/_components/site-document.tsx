import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
// Experimental React channel export — available because next.config.ts sets
// experimental.viewTransition (see docs/design-language.md, page transitions)
import { Suspense } from 'react'

import { AmbientBackground } from '~/components/ambient-background'
import { Dock, DockFallback } from '~/components/dock'
import { PreviewCardTimingProvider } from '~/components/preview-card-timing'
import {
  RouteMotionController,
  RouteViewTransition,
} from '~/components/route-motion-controller'
import { SiteFooter } from '~/components/site-footer'
import { ThemeProvider } from '~/components/theme-provider'
import { getGitHub, getSocial } from '~/lib/social-live'
import { PREPAINT_SCRIPT } from '~/lib/security/inline-scripts'
import { seo } from '~/lib/seo'
import { cn } from '~/lib/utils'

import { fontVariables } from '../fonts'

export const rootMetadata: Metadata = {
  metadataBase: seo.url,
  title: {
    default: 'Laxman K R',
    template: '%s | Laxman K R',
  },
}

export async function SiteDocument({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Live-but-cached social numbers (ISR via the fetch data cache) keep the
  // shared public chrome fresh without making any page request-bound.
  const [social, github] = await Promise.all([getSocial(), getGitHub()])

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
              <SiteFooter social={social} github={github} />
            </div>
            <Suspense fallback={<DockFallback />}>
              <Dock />
            </Suspense>
          </PreviewCardTimingProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}