// Root layout: every route renders inside `SiteDocument` (fonts, theme
// bootstrap, security shell, dock, footer). This file exists so Next's
// App Router has a stable, metadata-carrying root.
import './globals.css'

import { rootMetadata, SiteDocument } from './_components/site-document'

export const metadata = rootMetadata

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteDocument>{children}</SiteDocument>
}
