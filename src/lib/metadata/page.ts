import type { Metadata } from 'next'

import { siteIdentity } from '~/lib/content/personal'

import { seo } from './seo'

interface MetadataImage {
  url: string | URL
  width: number
  height: number
  alt: string
}

interface MetadataOptions {
  path: string
  title: string
  description: string
  type?: 'article' | 'website'
  image?: MetadataImage
}

export function pageUrl(path: string) {
  return new URL(path, seo.url)
}

function defaultMetadataImage(title: string): MetadataImage {
  return { url: pageUrl('/opengraph-image'), width: 1200, height: 630, alt: title }
}

export function pageMetadata({
  path,
  title,
  description,
  type = 'website',
  image,
}: MetadataOptions): Metadata {
  const canonical = pageUrl(path)
  const artwork = image ?? defaultMetadataImage(title)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type,
      locale: 'en_US',
      siteName: siteIdentity.name,
      url: canonical,
      images: [artwork],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [artwork],
    },
  }
}
