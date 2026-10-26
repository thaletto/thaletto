import type { Metadata } from 'next'
import { pageMetadata } from '~/lib/metadata/page'
import { seo } from '~/lib/metadata/seo'
import { HomePageView } from './_views/home-page'

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
