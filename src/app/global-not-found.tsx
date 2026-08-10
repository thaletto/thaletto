import type { Metadata } from 'next'

import './globals.css'
import { AmbientBackground } from '~/components/shell/ambient-background'
import { siteIdentity } from '~/lib/content/personal'
import { nonPublicDescriptions, nonPublicRobots } from '~/lib/metadata/non-public-metadata'
import { cn } from '~/lib/platform/utils'
import { PREPAINT_SCRIPT } from '~/lib/security/inline-scripts'
import { NotFoundPageView } from './_views/not-found-page'
import { fontVariables } from './fonts'

export const metadata: Metadata = {
  title: `404 | ${siteIdentity.name}`,
  description: nonPublicDescriptions.notFound,
  robots: nonPublicRobots,
}

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning className={cn('font-sans', fontVariables)}>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: authored bootstrap script, no runtime input */}
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <AmbientBackground />
        <main className="min-h-screen pt-14">
          <NotFoundPageView />
        </main>
      </body>
    </html>
  )
}
