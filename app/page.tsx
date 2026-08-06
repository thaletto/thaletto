import type { Metadata } from 'next'

import { HomePageView } from './_views/home-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { seoEn } from '~/lib/seo'

// The homepage shell prefetches and streams live content.
export const instant = true

export const metadata: Metadata = {
  ...localeMetadata({
    locale: 'en',
    path: '/',
    title: seoEn.title,
    description: seoEn.description,
  }),
  title: { absolute: seoEn.title },
}

export default function EnglishHomePage() {
  return <HomePageView locale="en" />
}
