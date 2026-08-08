import type { Metadata } from 'next'

import { HomePageView } from './_views/home-page'
import { pageMetadata } from '~/lib/metadata'
import { seo } from '~/lib/seo'

// The homepage shell prefetches and streams live content.
export const instant = true

export const metadata: Metadata = {
  ...pageMetadata({
    path: '/',
    title: seo.title,
    description: seo.description,
  }),
  title: { absolute: seo.title },
}

export default function Page() {
  return <HomePageView />
}