import type { Metadata } from 'next'

import { seo } from './seo'

interface MetadataOptions {
  path: string
  title: string
  description: string
  type?: 'article' | 'website'
}

export function pageUrl(path: string) {
  return new URL(path, seo.url)
}

/** Build server-rendered metadata for an English-only route. */
export function pageMetadata({
  path,
  title,
  description,
  type = 'website',
}: MetadataOptions): Metadata {
  const canonical = pageUrl(path)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type,
      locale: 'en_US',
      siteName: 'Laxman K R',
      url: canonical,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}