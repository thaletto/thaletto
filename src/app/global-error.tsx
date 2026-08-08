'use client'

import './globals.css'

import { AmbientBackground } from '~/components/shell/ambient-background'
import { ThemeProvider } from '~/components/shell/theme-provider'
import { cn } from '~/lib/platform/utils'
import { PREPAINT_SCRIPT } from '~/lib/security/inline-scripts'
import { type ErrorBoundaryProps, ErrorPageView } from './_views/error-page'
import { fontVariables } from './fonts'

export default function GlobalError({ retry }: ErrorBoundaryProps) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('font-sans', fontVariables)}>
      <head>
        <title>Something went wrong | Laxman K R</title>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: authored bootstrap script, no runtime input */}
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AmbientBackground />
          <main className="min-h-screen pt-14">
            <ErrorPageView retry={retry} />
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
