import type { Metadata } from 'next'

import './globals.css'
import { AmbientBackground } from '~/components/ambient-background'
import { PREPAINT_SCRIPT } from '~/lib/security/inline-scripts'
import {
  nonPublicDescriptions,
  nonPublicRobots,
} from '~/lib/non-public-metadata'
import { cn } from '~/lib/utils'

import { fontVariables } from './fonts'
import { NotFoundPageView } from './_views/not-found-page'

export const metadata: Metadata = {
  title: '404 | Laxman K R',
  description: nonPublicDescriptions.notFound,
  robots: nonPublicRobots,
}

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('font-sans', fontVariables)}
    >
      <head>
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
